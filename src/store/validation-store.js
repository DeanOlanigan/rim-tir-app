import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useValidationStore = create(
    devtools((set) => ({
        errors: {},
        setFieldErrors: (nodeId, param, validator, errors) =>
            set((state) => {
                const updated = { ...state.errors };

                if (errors.length) {
                    updated[nodeId] = { ...(updated[nodeId] || {}) };
                    updated[nodeId][param] = {
                        ...(updated[nodeId]?.[param] || {}),
                    };
                    updated[nodeId][param][validator] = errors;
                } else {
                    delete updated[nodeId]?.[param]?.[validator];
                    if (
                        updated[nodeId]?.[param] &&
                        !Object.keys(updated[nodeId]?.[param]).length
                    ) {
                        delete updated[nodeId]?.[param];
                    }
                    if (
                        updated[nodeId] &&
                        !Object.keys(updated[nodeId]).length
                    ) {
                        delete updated[nodeId];
                    }
                }
                return { errors: updated };
            }),

        clearErrors: (nodeIds) =>
            set((state) => {
                if (!nodeIds) return { errors: {} };

                const updated = { ...state.errors };
                nodeIds.forEach((id) => delete updated[id]);
                return { errors: updated };
            }),

        setBulkErrors: (newErrors) =>
            set((state) => {
                const updated = { ...state.errors };

                for (const [nodeId, params] of Object.entries(newErrors)) {
                    for (const [param, rules] of Object.entries(params)) {
                        for (const [validator, errors] of Object.entries(
                            rules
                        )) {
                            if (!updated[nodeId]) updated[nodeId] = {};
                            if (!updated[nodeId][param])
                                updated[nodeId][param] = {};
                            if (errors && errors.length) {
                                updated[nodeId][param][validator] = errors;
                            } else {
                                delete updated[nodeId][param][validator];
                            }
                        }
                        if (!Object.keys(updated[nodeId][param]).length) {
                            delete updated[nodeId][param];
                        }
                    }
                    if (!Object.keys(updated[nodeId]).length) {
                        delete updated[nodeId];
                    }
                }

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
