import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useJournalStream = create(
    devtools(
        (set) => ({
            isPaused: false,
            pausedData: [],
            live: [],

            hydrate: (data) =>
                set(
                    () => ({ live: data, paused: [] }),
                    undefined,
                    "journal/hydrate",
                ),

            pause: () =>
                set(
                    (state) => ({
                        isPaused: true,
                        live: state.live.concat({
                            date: Date.now(),
                            type: "Пауза",
                            var: "null",
                            val: "null",
                            group: "Пауза",
                            desc: "Журнал На Паузе",
                        }),
                    }),
                    undefined,
                    "journal/pause",
                ),

            resume: () =>
                set(
                    (state) => ({
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
                    }),
                    undefined,
                    "journal/resume",
                ),

            push: (rows) =>
                set(
                    (state) => {
                        if (!rows.length) return {};
                        const target = state.isPaused ? "pausedData" : "live";
                        const next = state[target].concat(rows);
                        return { [target]: next };
                    },
                    undefined,
                    "journal/push",
                ),
        }),
        {
            name: "journal-stream",
        },
    ),
);
