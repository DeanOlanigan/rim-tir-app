import { create } from "zustand";
import { useShallow } from "zustand/shallow";

function trim(arr, limit) {
    return arr.length > limit ? arr.slice(-limit) : arr;
}

const MAX_ROWS = 50000;

export const useLogStream = create((set) => ({
    isPaused: false,
    live: [],
    paused: [],

    hydrate: (rows) => set(() => ({ live: trim(rows, MAX_ROWS), paused: [] })),
    reset: () => set({ live: [], paused: [], isPaused: false }),
    pause: () =>
        set((state) => ({
            isPaused: true,
            live: trim(
                state.live.concat({
                    epochMs: Date.now(),
                    ts: new Date().toISOString(),
                    level: "status",
                    message: "Поставлено на паузу",
                }),
                MAX_ROWS
            ),
        })),

    resume: () =>
        set((state) => ({
            isPaused: false,
            live: trim(
                state.live.concat(state.paused).concat({
                    epochMs: Date.now(),
                    ts: new Date().toISOString(),
                    level: "status",
                    message: "Возобновлено",
                }),
                MAX_ROWS
            ),
            paused: [],
        })),

    push: (rows) =>
        set((state) => {
            if (!rows.length) return {};
            const target = state.isPaused ? "paused" : "live";
            const next = state[target].concat(rows);
            return { [target]: trim(next, MAX_ROWS) };
        }),
}));

export const useFilteredLogs = (filterSet) =>
    useLogStream(
        useShallow((state) => state.live.filter((r) => filterSet.has(r.level)))
    );
