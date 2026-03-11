import { authKeys } from "@/api/queryKeys";
import { queryClient } from "@/queryClients";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const MAX_ROWS = 10000;

function trimToMax(arr, max = MAX_ROWS) {
    if (arr.length <= max) return arr;
    return arr.slice(arr.length - max);
}

function createMarkerRow(kind) {
    const data = queryClient.getQueryData(authKeys.session());
    const ts = Date.now();

    if (kind === "pause") {
        return {
            type: "pause",
            ts,
            info: "Поток журнала поставлен на паузу",
            user: data?.user?.name ?? "",
            id: `pause-${ts}`,
            needAck: false,
        };
    }

    return {
        type: "resume",
        ts,
        info: "Поток журнала возобновлен",
        user: data?.user?.name ?? "",
        id: `resume-${ts}`,
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
