import { SCOPE, VALIDATOR } from "./const";
import { luaAstParse } from "@/pages/ConfigurationPage/InputComponents/DebouncedEditor/luaAstParser";
import { analyzeLuaForMonacoMarkers } from "@/pages/ConfigurationPage/InputComponents/DebouncedEditor/hooks/useLuaDiagnostics";
import { useValidationStore } from "@/store/validation-store";

import { configuratorConfig } from "../configurationParser";
import {
    customValidator,
    rangeValidator,
    regexValidator,
    requiredValidator,
    uniqueCompositeValidator,
    uniqueValidator,
} from "./validators";
import { validateCyclicVariable } from "./luaValidationService";
import { checkDependencies } from "./jsonLogic";
import { getContextIds } from "./contextUtils";

const validatorRegistry = {
    [VALIDATOR.RANGE]: rangeValidator,
    [VALIDATOR.REGEX]: regexValidator,
    [VALIDATOR.UNIQUE]: uniqueValidator,
    [VALIDATOR.CUSTOM]: customValidator,
    [VALIDATOR.REQUIRED]: requiredValidator,
    uniqueComposite: uniqueCompositeValidator,
};

function validateRules(rules, context, nodeId, inputParam) {
    const errors = {};
    const validatorTypes = Object.keys(validatorRegistry);
    for (const validator of validatorTypes) {
        const rulesOfType = (rules || []).filter(
            (r) => r.validator === validator
        );
        let matchedRule = null;
        for (const rule of rulesOfType) {
            if (
                rule.workIf &&
                checkDependencies(rule.workIf, context, nodeId)
            ) {
                matchedRule = rule;
                break;
            }
        }
        if (!matchedRule) {
            matchedRule = rulesOfType.find((r) => !r.workIf);
        }
        if (matchedRule) {
            const fn = validatorRegistry[validator];
            if (fn)
                fn({
                    nodeId,
                    param: inputParam,
                    rule: matchedRule,
                    context,
                    draft: errors,
                });
        }
    }
    return errors;
}

function findDepIds(settings, node, dependencies, res = []) {
    for (const dep of dependencies) {
        const [path, param] = dep.split(":");
        if (node.path === path) {
            res.push({ id: node.id, param });
        } else {
            for (const child of node.children) {
                findDepIds(settings, settings[child], dependencies, res);
            }
        }
    }
    return res;
}

function validateNode(rules, settings, nodeId) {
    const errors = validateRules(rules, settings, nodeId, null);
    useValidationStore.getState().setBulkErrors(errors);
}

export function validateParameter(
    id,
    inputParam,
    settings,
    returnErrors = false
) {
    const nodePath = settings[id].path; // #/iec104
    const settingPath = `${nodePath}:${inputParam}`; // #/iec104:lengthOfAdr

    const definition =
        configuratorConfig.nodePaths[nodePath].settings[inputParam];
    if (!definition) return;

    let rulesErrors;
    if (!definition.rules) {
        rulesErrors = { [id]: { [inputParam]: { required: [] } } };
    } else {
        rulesErrors = validateRules(definition.rules, settings, id, inputParam);
    }

    const dependencies = configuratorConfig.graph[settingPath]; // #/iec104/asdu/dataObject:address
    if (dependencies) {
        const depIds = findDepIds(settings, settings[id], dependencies);
        console.log("depIds", depIds);

        for (const { id, param } of depIds) {
            validateParameter(id, param, settings);
        }
    }

    const nodeRules = configuratorConfig.nodePaths[nodePath].validationRules;
    if (nodeRules) {
        validateNode(nodeRules, settings, id);
    }

    if (returnErrors) return rulesErrors;
    useValidationStore.getState().setBulkErrors(rulesErrors);
}

export function setDraftMessage(draft, nodeId, param, validator, message) {
    if (!draft[nodeId]) draft[nodeId] = {};
    if (!draft[nodeId][param]) draft[nodeId][param] = {};
    if (!draft[nodeId][param][validator]) draft[nodeId][param][validator] = [];
    draft[nodeId][param][validator] = message;
}

export function validateVisability(visibleIf, nodeId, settings) {
    return checkDependencies(visibleIf, settings, nodeId);
}

// TODO Бог покинул это место
// Refactor this function to reduce its Cognitive Complexity from 23 to the 15 allowed. eslintsonarjs/cognitive-complexity
export function validateAll(settings) {
    const errors = {};
    const map = {};
    const variables = [];
    const asts = [];
    for (const node of Object.values(settings)) {
        if (node.type === "variable") {
            variables.push(node);
            // TODO Подумать, как можно оптимизировать работу с ast (переиспользование)
            const { ast, error } = luaAstParse(node.setting.luaExpression);
            if (ast) asts.push({ id: node.id, ast });
            const markers = analyzeLuaForMonacoMarkers(ast, error);
            const codeError = {};
            setDraftMessage(
                codeError,
                node.id,
                "luaExpression",
                "code",
                markers.map((m) => m.message)
            );
            mergeErrors(errors, codeError);
        }
        if (node.name && node.rootId && node.type !== "dataObject") {
            const nameError = {};
            setDraftMessage(
                nameError,
                node.id,
                "name",
                VALIDATOR.REGEX,
                validateNamePatternMatch({ name: node.name })
            );
            mergeErrors(errors, nameError);
            if (!map[node.rootId]) map[node.rootId] = new Map();
            map[node.rootId].set(node.name, [
                ...(map[node.rootId].get(node.name) || []),
                node.id,
            ]);
        }
        if (node.setting) {
            for (const paramKey of Object.keys(node.setting)) {
                const paramError = validateParameter(
                    node.id,
                    paramKey,
                    settings,
                    true
                );
                mergeErrors(errors, paramError);
            }
        }
    }

    const nameErrors = {};
    for (const rootId in map) {
        for (const [name, ids] of map[rootId].entries()) {
            if (ids.length > 1) {
                ids.forEach((id) => {
                    nameErrors[id] = nameErrors[id] || {};
                    nameErrors[id].name = {
                        [VALIDATOR.UNIQUE]: [
                            `Значение "${name}" уже существует`,
                        ],
                    };
                });
            }
        }
    }
    mergeErrors(errors, nameErrors);
    useValidationStore.setState({ errors });

    validateCyclicVariable(variables);
}

const LUA_KEYWORDS = [
    "and",
    "break",
    "do",
    "else",
    "elseif",
    "end",
    "false",
    "for",
    "function",
    "goto",
    "if",
    "in",
    "local",
    "nil",
    "not",
    "or",
    "repeat",
    "return",
    "then",
    "true",
    "until",
    "while",
];

// Replace this character class by the character itself.eslintsonarjs/single-char-in-character-classes
const VARIABLE_NAME_PATTERN = /^[a-zA-Z_][\w]*$/;
function validateNamePatternMatch({ name }) {
    if (LUA_KEYWORDS.includes(name))
        return ["Имя узла содержит неподходящее слово"];
    if (!VARIABLE_NAME_PATTERN.test(name))
        return [
            "Имя узла должно начинаться с буквы или подчеркивания и содержать только буквы, цифры или подчеркивания",
        ];
    return [];
}

export function validateName({ id, settings, scope = SCOPE.ROOT }) {
    const errors = {};

    const name = settings[id]?.name;
    const error = validateNamePatternMatch({ name });
    setDraftMessage(errors, id, "name", VALIDATOR.REGEX, error);

    const ids = getContextIds(settings, id, "name", scope || SCOPE.ROOT);
    const map = new Map();
    for (const id of ids) {
        const val = settings[id]?.name;
        if (val === undefined || val == "") continue;
        if (!map.has(val)) map.set(val, []);
        map.get(val).push(id);
    }
    for (const id of ids) {
        const val = settings[id]?.name;
        const dupIds = map.get(val) || [];
        let msg = [];
        if (dupIds.length > 1) {
            msg = [`Значение "${val}" уже существует`];
        }
        setDraftMessage(errors, id, "name", VALIDATOR.UNIQUE, msg);
    }
    useValidationStore.getState().setBulkErrors(errors);
}

// Refactor this function to reduce its Cognitive Complexity from 18 to the 15 allowed. eslintsonarjs/cognitive-complexity
function mergeErrors(target, source) {
    if (!source) return;
    for (const [nodeId, params] of Object.entries(source)) {
        for (const [paramKey, validators] of Object.entries(params)) {
            for (const [validatorName, messages] of Object.entries(
                validators
            )) {
                if (messages?.length) {
                    target[nodeId] = target[nodeId] || {};
                    target[nodeId][paramKey] = target[nodeId][paramKey] || {};
                    target[nodeId][paramKey][validatorName] = messages;
                }
            }
            if (
                target[nodeId] &&
                target[nodeId][paramKey] &&
                !Object.keys(target[nodeId][paramKey]).length
            ) {
                delete target[nodeId][paramKey];
            }
        }
        if (target[nodeId] && !Object.keys(target[nodeId]).length) {
            delete target[nodeId];
        }
    }
}
