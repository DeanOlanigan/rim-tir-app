import {
    LOGIC,
    MATCH,
    PARAM_DEFINITIONS,
    SCOPE,
    VALIDATOR,
} from "@/config/paramDefinitions";
import { useValidationStore } from "@/store/validation-store";
import { useVariablesStore } from "@/store/variables-store";

// TODO подумать над формированием структуры ошибок с валидаторами
/* 
errors: {
    [nodeId]: {
        [param]: {
            unique: [],
            range: [],
            required: []
        }
    }
}
*/

export function validateModbusAdressUnique(id) {
    const settings = useVariablesStore.getState().settings;
    const parentNode = settings[settings[id].parentId];
    const seen = {};
    const errors = [];

    for (const childId of parentNode.children) {
        const child = settings[childId];
        const address = child.setting?.modbusDoAddress;
        const normalized = String(address).toLowerCase().trim();

        if (seen[normalized]) {
            errors.push(childId);
        } else {
            seen[normalized] = childId;
        }
    }

    return errors.length ? true : false;
}

function getContextValue(context, node, key, scope) {
    switch (scope) {
        case SCOPE.SELF:
            return node.setting ? node.setting[key] : undefined;
        case SCOPE.SIBLINGS: {
            if (!node.parentId) return [];
            const parent = context[node.parentId];
            return (parent.children || [])
                .filter((id) => id !== node.id)
                .map((id) => context[id]);
        }
        case SCOPE.PARENT: {
            let parent = node;
            while (parent.parentId) {
                parent = context[parent.parentId];
                if (parent.setting) {
                    const val = parent.setting[key];
                    if (val !== undefined) return val;
                }
            }
            return undefined;
        }
        default:
            return undefined;
    }
}

function checkDependencies(dependencies, context, node) {
    if (!dependencies) return true;
    if (dependencies.key) {
        const val = getContextValue(
            context,
            node,
            dependencies.key,
            dependencies.scope || SCOPE.SELF
        );
        if (Array.isArray(val)) {
            if (dependencies.match === MATCH.NONE) {
                return !val.some(
                    (item) =>
                        item.setting &&
                        item.setting[dependencies.key] === dependencies.value
                );
            }
            if (dependencies.match === MATCH.ALL) {
                return val.every(
                    (item) =>
                        item.setting &&
                        item.setting[dependencies.key] === dependencies.value
                );
            }
            return val.some(
                (item) =>
                    item.setting &&
                    item.setting[dependencies.key] === dependencies.value
            );
        } else {
            return val === dependencies.value;
        }
    }
    if (dependencies.type === LOGIC.AND) {
        return dependencies.conditions.every((condition) =>
            checkDependencies(condition, context, node)
        );
    }
    if (dependencies.type === LOGIC.OR) {
        return dependencies.conditions.some((condition) =>
            checkDependencies(condition, context, node)
        );
    }
    return true;
}

function validateRules(rules, value, context, node, inputParam) {
    const errors = {};
    errors[node.id] = { [inputParam]: {} };

    const validatoTypes = [
        VALIDATOR.RANGE,
        VALIDATOR.REGEX,
        VALIDATOR.UNIQUE,
        VALIDATOR.CUSTOM,
    ];

    for (const validator of validatoTypes) {
        const rulesOfType = (rules || []).filter(
            (r) => r.validator === validator
        );
        let matchedRule = null;

        for (const rule of rulesOfType) {
            if (
                rule.condition &&
                checkDependencies(rule.condition, context, node)
            ) {
                matchedRule = rule;
                break;
            }
        }

        if (!matchedRule) {
            matchedRule = rulesOfType.find((r) => !r.condition);
        }

        if (matchedRule) {
            if (!errors[node.id][inputParam][validator]) {
                errors[node.id][inputParam][validator] = [];
            }

            if (validator === VALIDATOR.RANGE) {
                const { min, max } = matchedRule.params || {};
                if (value < min || value > max) {
                    errors[node.id][inputParam][validator].push(
                        matchedRule.message || "Value is out of range"
                    );
                }
            }

            if (validator === VALIDATOR.REGEX) {
                const { pattern } = matchedRule.params || {};
                if (
                    typeof value !== "string" ||
                    !new RegExp(pattern).test(value)
                ) {
                    errors[node.id][inputParam][validator].push(
                        matchedRule.message || "Value does not match regex"
                    );
                }
            }

            if (validator === VALIDATOR.UNIQUE) {
                const { within } = matchedRule.params || {};
                let siblings = [];
                if (within === SCOPE.SIBLINGS) {
                    siblings = getContextValue(
                        context,
                        node,
                        null,
                        SCOPE.SIBLINGS
                    );
                }

                if (siblings.length) {
                    let isDuplicate = false;
                    siblings.forEach((sib) => {
                        if (!errors[sib.id]) {
                            errors[sib.id] = {};
                        }
                        if (!errors[sib.id][inputParam]) {
                            errors[sib.id][inputParam] = {};
                        }
                        if (!errors[sib.id][inputParam][validator]) {
                            errors[sib.id][inputParam][validator] = [];
                        }
                        if (sib.setting && sib.setting[inputParam] === value) {
                            isDuplicate = true;
                            errors[sib.id][inputParam][validator].push(
                                matchedRule.message || "Value is not unique"
                            );
                        }
                    });

                    if (isDuplicate) {
                        errors[node.id][inputParam][validator].push(
                            matchedRule.message || "Value is not unique"
                        );
                    }
                }
            }

            if (validator === VALIDATOR.CUSTOM) {
                const fn = matchedRule.params && matchedRule.params.fn;
                if (typeof fn === "function" && !fn(value)) {
                    errors[node.id][inputParam][validator].push(
                        matchedRule.message ||
                            "Value does not match custom validator"
                    );
                }
            }
        }
    }
    return errors;
}

export function validateParameter(
    definition,
    id,
    value,
    inputParam,
    settings = useVariablesStore.getState().settings
) {
    //const settings = useVariablesStore.getState().settings;
    const node = settings[id];
    /* const isVisible = validateVisability(definition, id);
    if (!isVisible) return []; */

    if (
        definition.required &&
        (value === undefined ||
            value === null ||
            value === "" ||
            value === false)
    ) {
        return { [id]: { [inputParam]: { required: ["Обязательное поле"] } } };
    }

    if (!definition.rules) {
        return { [id]: { [inputParam]: { required: [] } } };
    }

    const rulesErrors = validateRules(
        definition.rules,
        value,
        settings,
        node,
        inputParam
    );
    rulesErrors[id][inputParam].required = [];
    return rulesErrors;
}

export function validateVisability(dependencies, id) {
    const settings = useVariablesStore.getState().settings;
    const node = settings[id];
    return checkDependencies(dependencies, settings, node);
}

export function getSiblingsIds(settings, parentId) {
    if (!parentId) return [];
    return settings[parentId].children;
}

export function validateSiblings(verrors, settings, inputParam, parentId) {
    const ids = getSiblingsIds(settings, parentId);
    const result = verrors;
    for (const id of ids) {
        const node = settings[id];
        const def = PARAM_DEFINITIONS[inputParam];
        const value = node.setting[inputParam];
        const errors = validateParameter(def, id, value, inputParam, settings);
        result[id] = {
            ...verrors[id],
            [inputParam]: errors,
        };
    }
    return result;
}

export function validateAll(settings = useVariablesStore.getState().settings) {
    //const settings = useVariablesStore.getState().settings;
    let errors = {};

    for (const node of Object.values(settings)) {
        if (!node.setting) continue;
        Object.keys(node.setting).forEach((param) => {
            const def = PARAM_DEFINITIONS[param];
            if (def) {
                const error = validateParameter(
                    def,
                    node.id,
                    node.setting[param],
                    param,
                    settings
                );
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
            }
        });
    }
    console.log(errors);
    useValidationStore.setState({
        errors: errors,
    });
}
