import { create } from "zustand";
import { devtools } from "zustand/middleware";

const MAX_ROWS = 10000;

function trimToMax(arr, max = MAX_ROWS) {
    if (arr.length <= max) return arr;
    return arr.slice(arr.length - max);
}

function createMarkerRow(kind) {
    const ts = Date.now();

    if (kind === "pause") {
        return {
            id: `pause-${ts}`,
            ts,
            type: "pause",
            group: "pause",
            var: "",
            val: "",
            desc: "Журнал на паузе",
            needAck: false,
        };
    }

    return {
        id: `resume-${ts}`,
        ts,
        type: "resume",
        group: "resume",
        var: "",
        val: "",
        desc: "Журнал возобновлен",
        needAck: false,
    };
}

export const useJournalStream = create(
    devtools(
        (set) => ({
            isPaused: false,
            pausedData: [],
            live: [],

            hydrate: (data) =>
                set(
                    () => ({
                        live: trimToMax(data),
                        pausedData: [],
                    }),
                    undefined,
                    "journal/hydrate",
                ),

            pause: () =>
                set(
                    (state) => ({
                        isPaused: true,
                        live: trimToMax(
                            state.live.concat(createMarkerRow("pause")),
                        ),
                    }),
                    undefined,
                    "journal/pause",
                ),

            resume: () =>
                set(
                    (state) => ({
                        isPaused: false,
                        live: trimToMax(
                            state.live
                                .concat(state.pausedData)
                                .concat(createMarkerRow("resume")),
                        ),
                        pausedData: [],
                    }),
                    undefined,
                    "journal/resume",
                ),

            push: (rows) =>
                set(
                    (state) => {
                        if (!rows.length) return state;

                        const target = state.isPaused ? "pausedData" : "live";
                        const next = trimToMax(state[target].concat(rows));

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
