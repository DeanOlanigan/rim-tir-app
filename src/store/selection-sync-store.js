import { create } from "zustand";
import { useTreeRegistry } from "./tree-registry-store";

export const useSelectionSync = create((set, get) => ({
    silent: {},
    runSilent: async (scope, fn) => {
        set((s) => ({
            silent: { ...s.silent, [scope]: (s.silent[scope] ?? 0) + 1 },
        }));
        try {
            await fn();
        } finally {
            set((s) => ({
                silent: {
                    ...s.silent,
                    [scope]: Math.max(0, (s.silent[scope] ?? 1) - 1),
                },
            }));
        }
    },

    userSelect: (scope, active) => {
        const n = get().silent[scope] ?? 0;
        if (n > 0) return;
        const apis = useTreeRegistry.getState().getScopeApis(scope);
        for (const type of roots[scope]) {
            if (type !== active) {
                const api = apis[type];
                if (api && !api.hasNoSelection) api.deselectAll();
            }
        }
    },
}));

const roots = {
    config: ["send", "receive"],
    monitoring: ["send", "receive", "variables"],
};
