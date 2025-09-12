import { create } from "zustand";

export const useContextMenuStore = create()((set) => ({
    context: {
        apiPath: null,
        x: 0,
        y: 0,
        visible: false,
    },
    updateContext: (data) =>
        set((state) => {
            const next = { ...state.context, ...data };
            const prev = state.context;
            let changed = false;
            for (const k in next) {
                if (next[k] !== prev[k]) {
                    changed = true;
                    break;
                }
            }
            return changed ? { context: next } : state;
        }),
}));
