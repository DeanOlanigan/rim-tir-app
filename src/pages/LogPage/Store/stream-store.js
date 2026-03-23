import { create } from "zustand";
import { useShallow } from "zustand/shallow";

function trim(arr, limit) {
    return arr.length > limit ? arr.slice(-limit) : arr;
}

const MAX_ROWS = 50_000;

export const useLogStream = create((set) => ({
    live: [],

    hydrate: (rows) => set(() => ({ live: trim(rows, MAX_ROWS) })),

    reset: () => set({ live: [] }),

    push: (rows) =>
        set((state) => {
            if (!rows.length) return {};
            const next = state.live.concat(rows);
            return { live: trim(next, MAX_ROWS) };
        }),
}));

export const useFilteredLogs = (filterSet) =>
    useLogStream(
        useShallow((state) => state.live.filter((r) => filterSet.has(r.level))),
    );
