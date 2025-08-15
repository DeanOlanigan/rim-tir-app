import { checkDependencies } from "../engines/jsonlogic/jsonLogic";
import { ErrorDraft } from "../core/ErrorDraft";
import { validatorRegistry } from "../core/validationRegistry";

function validateRules(rules, context, nodeId, inputParam, draft) {
    if (!Array.isArray(rules) || rules.length === 0) return {};

    const byValidatorType = new Map();
    for (const rule of rules) {
        if (!rule || !rule.validator) continue;
        if (!byValidatorType.has(rule.validator))
            byValidatorType.set(rule.validator, []);
        byValidatorType.get(rule.validator).push(rule);
    }

    for (const [validator, group] of byValidatorType) {
        const matched =
            group.find(
                (rule) =>
                    rule.workIf &&
                    checkDependencies(rule.workIf, context, nodeId)
            ) ?? group.find((rule) => !rule.workIf);

        if (!matched) continue;

        const fn = validatorRegistry[validator];
        if (typeof fn === "function")
            fn({
                nodeId,
                param: inputParam,
                rule: matched,
                context,
                draft,
            });
    }
}

/**
 * Builds an index mapping paths to parameters from a list of dependency strings.
 *
 * @param {Array} deps - An array of dependency strings, each formatted as "path:param".
 * @returns {Map} A map where each key is a path (string) and its value is an array of parameters (strings) associated with that path.
 */
function buildPathIndex(deps) {
    const map = new Map();
    for (const d of deps) {
        if (typeof d !== "string") continue;
        const i = d.lastIndexOf(":");
        if (i <= 0 || i === d.length - 1) continue;

        const path = d.slice(0, i);
        const param = d.slice(i + 1);

        const arr = map.get(path);
        if (arr) arr.push(param);
        else map.set(path, [param]);
    }
    return map;
}

/**
 * Finds all dependency IDs by traversing the settings tree, given a root node and an array of dependency strings.
 *
 * @param {Object} settings - A map of node IDs to objects representing each node in the settings tree.
 * @param {Object} node - The root node of the subtree to traverse.
 * @param {Array} dependencies - An array of dependency strings, each formatted as "path:param".
 * @returns {Array} An array of objects, each containing an "id" and "param" property, representing the dependency IDs found.
 */
function findDepIds(settings, node, dependencies) {
    if (!node || !dependencies || !settings) return [];

    const pathToParams = buildPathIndex(dependencies);
    if (pathToParams.size === 0) return [];

    const ids = [];
    const stack = [node];

    while (stack.length) {
        const node = stack.pop();
        if (!node) continue;

        const params = pathToParams.get(node.path);
        if (params) {
            for (const param of params) {
                ids.push({ id: node.id, param });
            }
        }

        const children = node.children || [];
        for (const childId of children) {
            const child = settings[childId];
            if (child) stack.push(child);
        }
    }

    return ids;
}

function validateNode(rules, settings, nodeId, draft) {
    validateRules(rules, settings, nodeId, null, draft);
}

export function validateParameter(
    id,
    param,
    settings,
    cfg,
    draft = new ErrorDraft(),
    visited = new Set()
) {
    const key = `${id}:${param}`;
    if (visited.has(key)) return draft;
    visited.add(key);
    const nodePath = settings[id].path; // #/iec104
    const settingPath = `${nodePath}:${param}`; // #/iec104:lengthOfAdr

    const def = cfg.nodePaths[nodePath].settings[param];

    if (def?.rules?.length) {
        validateRules(def.rules, settings, id, param, draft);
    }

    const nodeRules = cfg.nodePaths[nodePath].validationRules;
    if (nodeRules) validateNode(nodeRules, settings, id, draft);

    const deps = cfg.graph[settingPath]; // #/iec104/asdu/dataObject:address
    if (deps) {
        const depIds = findDepIds(settings, settings[id], deps);

        for (const { id, param } of depIds) {
            validateParameter(id, param, settings, cfg, draft, visited);
        }
    }
    return draft;
}
