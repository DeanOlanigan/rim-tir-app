import { create } from "zustand";

export const useJournalStream = create((set) => ({
    isPaused: false,
    pausedData: [],
    live: [],

    hydrate: (data) => set(() => ({ live: data, paused: [] })),

    pause: () =>
        set((state) => ({
            isPaused: true,
            live: state.live.concat({
                date: Date.now(),
                type: "Пауза",
                var: "null",
                val: "null",
                group: "Пауза",
                desc: "Журнал На Паузе",
            }),
        })),

    resume: () =>
        set((state) => ({
            isPaused: false,
            live: state.live.concat(state.pausedData).concat({
                date: Date.now(),
                type: "Старт",
                var: "null",
                val: "null",
                group: "Возобновлен",
                desc: "Журнал Возобновлен",
            }),
            pausedData: [],
        })),

    push: (rows) =>
        set((state) => {
            if (!rows.length) return {};
            const target = state.isPaused ? "pausedData" : "live";
            const next = state[target].concat(rows);
            return { [target]: next };
        }),
}));
