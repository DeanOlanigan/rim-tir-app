import { create } from "zustand";

export const useTreeRegistry = create((set, get) => ({
    apis: {},
    setApi: (scope, type, api) =>
        set((state) => {
            const group = { ...(state.apis[scope] ?? {}) };
            if (api) group[type] = api;
            else delete group[type];
            return { apis: { ...state.apis, [scope]: group } };
        }),
    getApi: (scope, type) => get().apis[scope]?.[type] ?? null,
    getScopeApis: (scope) => get().apis[scope] ?? {},
}));
