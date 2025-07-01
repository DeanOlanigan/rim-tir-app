import {
    LOGIC,
    MATCH,
    PARAM_DEFINITIONS,
    SCOPE,
    VALIDATOR,
} from "@/config/paramDefinitions";
import { findCyclic } from "@/pages/ConfigurationPage/InputComponents/DebouncedEditor/useCyclicDepsFinder";
import { useValidationStore } from "@/store/validation-store";
import { parse } from "luaparse";

const validatorRegistry = {
    [VALIDATOR.RANGE]: rangeValidator,
    [VALIDATOR.REGEX]: regexValidator,
    [VALIDATOR.UNIQUE]: uniqueValidator,
    [VALIDATOR.CUSTOM]: customValidator,
    [VALIDATOR.REQUIRED]: requiredValidator,
};

function getContextIds(context, nodeId, param, scope) {
    switch (scope) {
        case SCOPE.SELF:
            return [nodeId];
        case SCOPE.SIBLINGS: {
            const parentId = context[nodeId]?.parentId;
            if (!parentId) return [];
            const parent = context[parentId];
            return parent.children ?? [];
        }
        case SCOPE.PARENT: {
            let parent = context[nodeId];
            while (parent.parentId) {
                parent = context[parent.parentId];
                if (parent.setting) {
                    const val = parent.setting[param];
                    if (val) return [parent.id];
                }
            }
            return [];
        }
        case SCOPE.ROOT: {
            const ids = [];
            const rootId = context[nodeId]?.rootId;
            if (!rootId) return [];
            function dfs(id) {
                ids.push(id);
                const children = context[id]?.children || [];
                for (const childId of children) {
                    dfs(childId);
                }
            }
            dfs(rootId);
            return ids;
        }
        case SCOPE.IGNOREFOLDER: {
            const ids = [];
            const parentId = context[nodeId]?.parentId;
            if (!parentId) return [];
            function getMeanId(id) {
                if (context[id].type === "folder")
                    return getMeanId(context[id].parentId);
                return id;
            }
            function dfs(id) {
                ids.push(id);
                const children = context[id]?.children || [];
                for (const childId of children) {
                    dfs(childId);
                }
            }
            const meanId = getMeanId(parentId);
            dfs(meanId);
            return ids;
        }
        default:
            return [];
    }
}

function checkDependencies(dependencies, context, nodeId) {
    if (!dependencies) return true;
    if (dependencies.key) {
        const ids = getContextIds(
            context,
            nodeId,
            dependencies.key,
            dependencies.scope || SCOPE.SELF
        );

        const pred = (id) =>
            context[id]?.setting &&
            context[id].setting[dependencies.key] === dependencies.value;
        switch (dependencies.match) {
            case MATCH.NONE:
                return !ids.some(pred);
            case MATCH.ALL:
                return ids.every(pred);
            default:
                return ids.some(pred);
        }
    }
    if (dependencies.type === LOGIC.AND) {
        return dependencies.conditions.every((condition) =>
            checkDependencies(condition, context, nodeId)
        );
    }
    if (dependencies.type === LOGIC.OR) {
        return dependencies.conditions.some((condition) =>
            checkDependencies(condition, context, nodeId)
        );
    }
    if (dependencies.type === LOGIC.NOT) {
        return !checkDependencies(dependencies.condition, context, nodeId);
    }
    return true;
}

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
                rule.condition &&
                checkDependencies(rule.condition, context, nodeId)
            ) {
                matchedRule = rule;
                break;
            }
        }

        if (!matchedRule) {
            matchedRule = rulesOfType.find((r) => !r.condition);
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

export function validateParameter(id, inputParam, settings) {
    const definition = PARAM_DEFINITIONS[inputParam];
    if (!definition) return;

    if (!definition.rules) {
        return { [id]: { [inputParam]: { required: [] } } };
    }

    const rulesErrors = validateRules(
        definition.rules,
        settings,
        id,
        inputParam
    );

    return rulesErrors;
}

function rangeValidator({ nodeId, param, rule, context, draft }) {
    const { min, max } = rule.params || {};
    const val = context[nodeId]?.setting?.[param];
    const res =
        (min != null ? val >= min : true) && (max != null ? val <= max : true);
    setDraftMessage(
        draft,
        nodeId,
        param,
        VALIDATOR.RANGE,
        res ? [] : [rule.message || `Value must be between ${min} and ${max}`]
    );
}

function regexValidator({ nodeId, param, rule, context, draft }) {
    const { pattern } = rule.params || {};
    const re = rule._regex || (rule._regex = new RegExp(pattern));
    const val = context[nodeId]?.setting?.[param];
    const res = typeof val === "string" && re.test(val);
    setDraftMessage(
        draft,
        nodeId,
        param,
        VALIDATOR.REGEX,
        res ? [] : [rule.message || "Value does not match regex"]
    );
}

function customValidator({ nodeId, param, rule, context, draft }) {
    const fn = rule.params?.fn;
    const val = context[nodeId]?.setting?.[param];
    const res = typeof fn === "function" ? fn(nodeId, context, val) : true;
    setDraftMessage(
        draft,
        nodeId,
        param,
        VALIDATOR.CUSTOM,
        res ? [] : [rule.message || "Value does not match custom validator"]
    );
}

function uniqueValidator({ nodeId, param, rule, context, draft }) {
    const { within } = rule.params || {};
    const ids = getContextIds(context, nodeId, param, within || SCOPE.SIBLINGS);

    const map = new Map();
    for (const id of ids) {
        const val = context[id]?.setting?.[param];
        if (val === undefined || val == "") continue;
        if (!map.has(val)) map.set(val, []);
        map.get(val).push(id);
    }
    for (const id of ids) {
        const val = context[id]?.setting?.[param];
        const dupIds = map.get(val) || [];
        let msg = [];
        if (dupIds.length > 1) {
            msg = [
                rule.message ||
                    `Значение "${val}" уже существует: ${dupIds
                        .filter((dId) => dId !== id)
                        .join(", ")}`,
            ];
        }
        setDraftMessage(draft, id, param, VALIDATOR.UNIQUE, msg);
    }
}

function requiredValidator({ nodeId, param, rule, context, draft }) {
    const val = context[nodeId]?.setting?.[param];
    const res =
        val !== undefined && val !== null && val !== "" && val !== false;
    setDraftMessage(
        draft,
        nodeId,
        param,
        VALIDATOR.REQUIRED,
        res ? [] : [rule.message || "Обязательное поле"]
    );
}

function setDraftMessage(draft, nodeId, param, validator, message) {
    if (!draft[nodeId]) draft[nodeId] = {};
    if (!draft[nodeId][param]) draft[nodeId][param] = {};
    if (!draft[nodeId][param][validator]) draft[nodeId][param][validator] = [];
    draft[nodeId][param][validator] = message;
}

export function validateVisability(dependencies, nodeId, settings) {
    return checkDependencies(dependencies, settings, nodeId);
}

// TODO Бог покинул это место
export function validateAll(settings) {
    const errors = {};
    const map = {};
    const variables = [];
    for (const node of Object.values(settings)) {
        if (node.type === "variable") {
            variables.push(node);
            const codeError = {};
            codeError[node.id] = codeError[node.id] || {};
            codeError[node.id].luaExpression = {
                ["code"]: analyzeLuaAST(node.setting.luaExpression),
            };
            mergeErrors(errors, codeError);
        }
        if (node.name && node.rootId) {
            const nameError = {};
            nameError[node.id] = nameError[node.id] || {};
            nameError[node.id].name = {
                [VALIDATOR.REGEX]: validateLuaIdentifier({ name: node.name }),
            };
            mergeErrors(errors, nameError);
            if (!map[node.rootId]) map[node.rootId] = new Map();
            map[node.rootId].set(node.name, [
                ...(map[node.rootId].get(node.name) || []),
                node.id,
            ]);
        }
        if (node.setting)
            for (const paramKey of Object.keys(node.setting)) {
                const paramError = validateParameter(
                    node.id,
                    paramKey,
                    settings
                );
                mergeErrors(errors, paramError);
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
const VARIABLE_NAME_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
function validateLuaIdentifier({ name }) {
    if (LUA_KEYWORDS.includes(name))
        return ["Имя узла содержит неподходящее слово"];
    if (!VARIABLE_NAME_PATTERN.test(name))
        return [
            "Разрешены только буквы латинского алфавита, цифры и нижнее подчеркивание",
        ];
    return [];
}

export function validateName({ id, settings, scope = SCOPE.ROOT }) {
    const errors = {};

    const name = settings[id]?.name;
    const error = validateLuaIdentifier({ name });
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

export function validateCyclicVariable(variables) {
    const cyclicFinderResult = findCyclic(variables);
    const errors = {};
    for (const [nodeId, val] of Object.entries(cyclicFinderResult)) {
        let msg;
        if (val) {
            const names = val
                .map((v) => variables.find((v2) => v2.id === v).name)
                .join("->");
            msg = [`Обнаружена циклическая зависимость: ${names}`];
        } else {
            msg = [];
        }
        setDraftMessage(errors, nodeId, "name", "cyclic", msg);
    }
    useValidationStore.getState().setBulkErrors(errors);
}

// TODO ВСЯ РАБОТА С ЛУА ДОЛЖНА БЫТЬ ВЫНЕСЕНА В ОТДЕЛЬНЫЙ МОДУЛЬ
// Касает как этого файла, так и useLuaDiagnostic

export function setLuaCodeError(id, errorMsg) {
    const errors = {};
    setDraftMessage(
        errors,
        id,
        "luaExpression",
        "code",
        errorMsg ? errorMsg : []
    );
    useValidationStore.getState().setBulkErrors(errors);
}

const ALLOWED_FUNCTIONS = [
    "self",
    "update",
    "delay",
    "set",
    "abs",
    "sin",
    "cos",
    "sqrt",
];

function analyzeLuaAST(code) {
    let errors = [];
    let ast;
    try {
        ast = parse(code, { locations: true });
    } catch (error) {
        return [`Ошибка в скрипте: ${error.message}`];
    }

    function walk(node, parent) {
        if (!node) return;

        switch (node.type) {
            case "LocalStatement":
                errors.push("Локальные переменные не поддерживаются");
                break;
            case "FunctionDeclaration": {
                let isAllowed = false;
                if (
                    parent &&
                    parent.type === "CallExpression" &&
                    parent.base.type === "Identifier" &&
                    parent.base.name === "delay"
                ) {
                    const idx = parent.arguments.indexOf(node);
                    if (idx === 1) {
                        isAllowed = true;
                    }
                }
                if (!isAllowed) {
                    errors.push("Функции не поддерживаются");
                }
                break;
            }
            case "ForNumericStatement":
                errors.push("Циклы for не поддерживаются");
                break;
            case "ForGenericStatement":
                errors.push("Циклы for не поддерживаются");
                break;
            case "WhileStatement":
                errors.push("Циклы while не поддерживаются");
                break;
            case "RepeatStatement":
                errors.push("Циклы repeat не поддерживаются");
                break;
            case "GotoStatement":
                errors.push("Goto не поддерживается");
                break;
            case "BreakStatement":
                errors.push("Break не поддерживается");
                break;
            case "ReturnStatement":
                errors.push("Return не поддерживается");
                break;
            default:
                break;
        }

        if (node.type === "CallExpression") {
            let functionName = "";
            if (node.base.type === "Identifier") {
                functionName = node.base.name;
            } else if (node.base.type === "MemberExpression") {
                functionName = node.base.identifier.name;
            }
            if (functionName && !ALLOWED_FUNCTIONS.includes(functionName)) {
                errors.push(`Функция ${functionName} не поддерживается`);
            }
        }

        for (const key in node) {
            if (Array.isArray(node[key])) {
                node[key].forEach((child) => {
                    if (typeof child === "object" && child !== null) {
                        walk(child, node);
                    }
                });
            } else if (typeof node[key] === "object" && node[key] !== null) {
                walk(node[key], node);
            }
        }
    }

    walk(ast, null);
    return errors.length > 0 ? errors : [];
}
