// src/pages/JournalPage/journal-history-store.js
import { getLocalTimeZone, today } from "@internationalized/date";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const DEFAULT_PERIOD_DAYS = 3;
const DEFAULT_SEVERITY = ["error", "warning", "info", "critical"];
const DEFAULT_CATEGORY = [
    "variable",
    "user",
    "event",
    "config",
    "hmi",
    "server",
    "settings",
    "security",
    "system",
];

function getDefaultHistoryFilters() {
    const tz = getLocalTimeZone();
    const to = today(tz);
    const from = to.subtract({ days: DEFAULT_PERIOD_DAYS });

    return {
        period: {
            from,
            to,
        },
        severity: DEFAULT_SEVERITY,
        category: DEFAULT_CATEGORY,
    };
}

export const DEFAULT_JOURNAL_HISTORY_FILTERS = getDefaultHistoryFilters();

export const useJournalHistoryStore = create(
    devtools(
        (set) => ({
            filters: DEFAULT_JOURNAL_HISTORY_FILTERS,

            setFilters: (nextFilters) =>
                set((state) => ({
                    filters: {
                        period: {
                            from:
                                nextFilters?.period?.from ??
                                state.filters.period.from,
                            to:
                                nextFilters?.period?.to ??
                                state.filters.period.to,
                        },
                        severity: Array.isArray(nextFilters?.severity)
                            ? nextFilters.severity
                            : [],
                        category: Array.isArray(nextFilters?.category)
                            ? nextFilters.category
                            : [],
                    },
                })),

            resetFilters: () =>
                set(() => ({
                    filters: getDefaultHistoryFilters(),
                })),
        }),
        {
            name: "journal-history-store",
        },
    ),
);
