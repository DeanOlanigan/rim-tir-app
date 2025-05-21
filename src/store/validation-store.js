import { create } from "zustand";
import { devtools } from "zustand/middleware";

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

export const useValidationStore = create(
    devtools((set) => ({
        errors: {},
        setFieldErrors: (id, field, errors) =>
            set((state) => ({
                errors: {
                    ...state.errors,
                    [id]: {
                        ...state.errors[id],
                        [field]: errors,
                    },
                },
            })),

        clearErrors: (ids) =>
            set((state) => {
                const updated = { ...state.errors };
                ids.forEach((id) => {
                    delete updated[id];
                });
                return { errors: updated };
            }),

        /* setBulkErrors: (errors) =>
            set((state) => ({
                errors: {
                    ...state.errors,
                    ...errors,
                },
            })), */

        setBulkErrors: (newErrors) =>
            set((state) => {
                const updated = { ...state.errors };

                Object.entries(newErrors).forEach(([nodeId, paramErrors]) => {
                    updated[nodeId] = { ...(updated[nodeId] || {}) };
                    Object.entries(paramErrors).forEach(
                        ([param, validatorMsgs]) => {
                            updated[nodeId][param] = {
                                ...(updated[nodeId][param] || {}),
                            };

                            Object.entries(validatorMsgs).forEach(
                                ([validatorType, msgs]) => {
                                    if (!msgs || !msgs.length) {
                                        // Если ошибок данного валидатора нет — удаляем ключ
                                        delete updated[nodeId][param][
                                            validatorType
                                        ];
                                    } else {
                                        updated[nodeId][param][validatorType] =
                                            msgs;
                                    }
                                }
                            );

                            // Очищаем param, если там больше нет ошибок ни одного типа валидатора
                            if (!Object.keys(updated[nodeId][param]).length) {
                                delete updated[nodeId][param];
                            }
                        }
                    );

                    // Очищаем nodeId, если там больше нет ошибок ни по одному параметру
                    if (!Object.keys(updated[nodeId]).length) {
                        delete updated[nodeId];
                    }
                });

                return { errors: updated };
            }),
    }))
);

export function selectParamsErrors(state, nodeId, param) {
    const paramErrorsObj = state.errors?.[nodeId]?.[param];
    if (!paramErrorsObj) return [];
    return Object.values(paramErrorsObj).flat();
}

export function selectNodeErrors(state, nodeId) {
    const nodeErrorsObj = state.errors?.[nodeId];
    if (!nodeErrorsObj) return [];
    return Object.values(Object.values(nodeErrorsObj)[0]).flat();
}
