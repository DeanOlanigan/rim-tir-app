import { NODE_TYPES, VALIDATOR } from "../utils/const";
import { ErrorDraft } from "../core/ErrorDraft";
/* import {
    validateCode,
    validateCyclicVariable,
} from "../engines/luaValidationService"; */
import { luaAstParse } from "../engines/luaValidationService";
import { validateNamePatternMatch } from "../rules/name/nameValidation";
import { validateParameter } from "./validateParameter";
import { NODE_UNIQUE_NAMES } from "@/config/constants";
import { tarjanCyclicDeps } from "../engines/luaValidationService/tarjan";

/* export function validateAllOld(settings, configuratorConfig) {
    const t0 = performance.now();
    const draft = new ErrorDraft();
    const map = {};
    const variables = [];
    const asts = new Map();
    for (const node of Object.values(settings)) {
        validateVariableCode(node, variables, asts, draft);
        validateNamePattern(node, draft, map);
        validateSettings(node, settings, draft, configuratorConfig);
    }

    for (const rootId in map) {
        for (const [name, ids] of map[rootId].entries()) {
            if (ids.length > 1) {
                ids.forEach((id) => {
                    draft.set(id, "name", VALIDATOR.UNIQUE, [
                        `Значение "${name}" уже существует`,
                    ]);
                });
            } else {
                draft.set(ids[0], "name", VALIDATOR.UNIQUE, []);
            }
        }
    }

    validateCyclicVariable({ variables, draft });
    console.log("ALL VALIDATION DRAFT", draft, performance.now() - t0);
    return draft;
} */

/* function validateVariableCode(node, variables, asts, draft) {
    if (node.type === "variable") {
        variables.push(node);
        // TODO Подумать, как можно оптимизировать работу с ast (переиспользование)
        const { ast, error } = luaAstParse(node.setting.luaExpression);
        if (ast) asts.set(node.id, { id: node.id, ast });
        //console.log(asts);
        const markers = validateCode(ast, error);
        draft.set(
            node.id,
            "luaExpression",
            "code",
            markers.map((m) => m.message)
        );
    }
} */

/* function validateNamePattern(node, draft, map) {
    if (node.name && node.rootId && NODE_UNIQUE_NAMES.has(node.type)) {
        draft.set(
            node.id,
            "name",
            VALIDATOR.REGEX,
            validateNamePatternMatch(node.name)
        );
        if (!map[node.rootId]) map[node.rootId] = new Map();
        map[node.rootId].set(node.name, [
            ...(map[node.rootId].get(node.name) || []),
            node.id,
        ]);
    }
} */

export function validateAll(settings, configuratorConfig) {
    const t0 = performance.now();
    const draft = new ErrorDraft();

    const varIdsByName = new Map();
    const varNameById = new Map();
    const depGraphById = {};

    const uniqueBuckets = new Map();

    for (const node of Object.values(settings)) {
        getVariableMaps(node, varIdsByName, varNameById);
        validateNamePatternOnePass(node, uniqueBuckets, draft);
        validateSettings(node, settings, configuratorConfig, draft);
    }

    validateVariableSpecific(
        varNameById,
        varIdsByName,
        depGraphById,
        settings,
        draft
    );

    console.log("ALL VALIDATION DRAFT", draft, performance.now() - t0);
    return draft;
}

function validateNamePatternOnePass(node, buckets, draft) {
    if (node.name && node.rootId && NODE_UNIQUE_NAMES.has(node.type)) {
        const regexErrors = validateNamePatternMatch(node.name);
        draft.set(node.id, "name", VALIDATOR.REGEX, regexErrors);

        let rootMap = buckets.get(node.rootId);
        if (!rootMap) {
            rootMap = new Map();
            buckets.set(node.rootId, rootMap);
        }

        let entry = rootMap.get(node.name);
        if (!entry) {
            entry = { firstId: node.id, hasDup: false };
            rootMap.set(node.name, entry);
            draft.set(node.id, "name", VALIDATOR.UNIQUE, []);
        } else {
            if (!entry.hasDup) {
                entry.hasDup = true;
                draft.set(entry.firstId, "name", VALIDATOR.UNIQUE, [
                    `Значение "${node.name}" уже существует`,
                ]);
            }
            draft.set(node.id, "name", VALIDATOR.UNIQUE, [
                `Значение "${node.name}" уже существует`,
            ]);
        }
    }
}

function validateSettings(node, settings, configuratorConfig, draft) {
    if (!node.setting) return;
    for (const paramKey of Object.keys(node.setting)) {
        validateParameter(
            node.id,
            paramKey,
            settings,
            configuratorConfig,
            draft
        );
    }
}

function getVariableMaps(node, varIdsByName, varNameById) {
    if (node.type !== NODE_TYPES.variable) return;
    const name = node.name ?? "";
    if (!varIdsByName.has(name)) varIdsByName.set(name, new Set());
    varIdsByName.get(name).add(node.id);
    varNameById.set(node.id, name);
}

function addToDepGraph(varsToCheckCycle, depGraphById, varIdsByName, id) {
    for (const rName of varsToCheckCycle) {
        if (!rName) continue;
        const targets = varIdsByName.get(rName) ?? new Set();
        if (targets.size === 1) {
            const [targetId] = targets;
            if (!depGraphById[id]) depGraphById[id] = new Set();
            depGraphById[id].add(targetId);
        }
    }
}

export function validateVariableSpecific(
    varNameById,
    varIdsByName,
    depGraphById,
    settings,
    draft
) {
    for (const id of varNameById.keys()) {
        const node = settings[id];
        const expr = node.setting?.luaExpression;
        if (!expr) continue;
        const { markers, varsToCheckCycle } = luaAstParse(expr, varIdsByName);
        draft.set(
            id,
            "luaExpression",
            "code",
            markers.map((m) => m.message)
        );
        addToDepGraph(varsToCheckCycle, depGraphById, varIdsByName, id);
    }

    validateVariableCyclic(depGraphById, varNameById, draft);
}

function validateVariableCyclic(depGraphById, varNameById, draft) {
    const tarjan = tarjanCyclicDeps(depGraphById);
    for (const [nodeId, scc] of Object.entries(tarjan)) {
        let msg = [];
        if (scc) {
            const names = scc.map((v) => varNameById.get(v)).join("->");
            msg = [`Обнаружена циклическая зависимость: ${names}`];
        }
        draft.set(nodeId, "name", "cyclic", msg);
    }
}
