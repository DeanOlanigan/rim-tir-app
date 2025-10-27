import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePauseStore = create(
    persist(
        (set) => ({
            isPaused: false,
            pausedData: [],
            live: [],

            pause: () =>
                set((state) => ({
                    isPaused: true,
                    live: 
                        state.live.concat({
                            date: new Date().toLocaleString(),
                            type: "Пауза",
                            var: "null",
                            val: "null",
                            group: "Пауза",
                            desc: "Журнал На Паузе"
                        }),
                })),

            resume: () =>
                set((state) => ({
                    isPaused: false,
                    live:
                        state.live.concat(state.pausedData).concat({
                            date: new Date().toLocaleString(),
                            type: "Старт",
                            var: "null",
                            val: "null",
                            group: "Возобновлен",
                            desc: "Журнал Возобновлен"
                        }),
                    pausedData: [],
                })),

            push: (rows) =>
                set((state) => {
                    if (!rows.length) return {};
                    const target = state.isPaused ? "pausedData" : "live";
                    const next = state[target].concat(rows);
                    return { [target]: next };
                })
        }),
        {
            name: "pause-store"
        }
    )
);