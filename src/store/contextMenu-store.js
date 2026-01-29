import { create } from "zustand";

export const useContextMenuStore = create()((set) => ({
    cfg: {
        apiPath: null,
        x: 0,
        y: 0,
        visible: false,
    },
    mnt: {
        apiPath: null,
        x: 0,
        y: 0,
        visible: false,
    },
    sch: {
        apiPath: null,
        x: 0,
        y: 0,
        visible: false,
    },
    updateContext: (type, data) =>
        set((state) => {
            const next = { ...state[type], ...data };
            const prev = state[type];
            let changed = false;
            for (const k in next) {
                if (next[k] !== prev[k]) {
                    changed = true;
                    break;
                }
            }
            return changed ? { [type]: next } : state;
        }),
}));
