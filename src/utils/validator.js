import {
    LOGIC,
    MATCH,
    PARAM_DEFINITIONS,
    SCOPE,
    VALIDATOR,
} from "@/config/paramDefinitions";
import { useValidationStore } from "@/store/validation-store";
import { useVariablesStore } from "@/store/variables-store";

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
        // TODO Без корневого узла не работает
        case SCOPE.ROOT:
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

export function validateParameter(
    id,
    inputParam,
    settings = useVariablesStore.getState().settings
) {
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

export function validateVisability(
    dependencies,
    nodeId,
    settings = useVariablesStore.getState().settings
) {
    return checkDependencies(dependencies, settings, nodeId);
}

// TODO Бог покинул это место
export function validateAll(settings = useVariablesStore.getState().settings) {
    //const settings = useVariablesStore.getState().settings;
    let errors = {};

    for (const node of Object.values(settings)) {
        if (!node.setting) continue;
        Object.keys(node.setting).forEach((param) => {
            const error = validateParameter(node.id, param, settings);
            if (error) {
                // error — это {[nodeId]: {[param]: {[validator]: [messages]}}}
                Object.entries(error).forEach(([nodeId, paramErrors]) => {
                    if (!errors[nodeId]) errors[nodeId] = {};
                    Object.entries(paramErrors).forEach(
                        ([p, validatorErrors]) => {
                            if (!errors[nodeId][p]) errors[nodeId][p] = {};
                            Object.entries(validatorErrors).forEach(
                                ([validator, msgs]) => {
                                    if (msgs && msgs.length) {
                                        errors[nodeId][p][validator] = msgs;
                                    } else {
                                        delete errors[nodeId][p][validator];
                                    }
                                }
                            );
                            // если нет ошибок валидаторов, удалить param
                            if (!Object.keys(errors[nodeId][p]).length) {
                                delete errors[nodeId][p];
                            }
                        }
                    );
                    // если нет ошибок параметров, удалить node
                    if (!Object.keys(errors[nodeId]).length) {
                        delete errors[nodeId];
                    }
                });
            }
        });
    }
    console.log(errors);
    useValidationStore.setState({
        errors: errors,
    });
}
