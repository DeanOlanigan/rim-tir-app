// src/pages/JournalPage/journal-history-store.js
import { create } from "zustand";

const initialCategory = new Set([
    "variable",
    "user",
    "event",
    "config",
    "hmi",
    "server",
    "settings",
    "security",
    "system",
]);

const initialSeverity = new Set(["error", "warning", "info", "critical"]);

function getDefaultRange() {
    const to = new Date();
    const from = new Date(to.getTime() - 3 * 24 * 60 * 60 * 1000);

    return {
        from: from.toISOString(),
        to: to.toISOString(),
    };
}

export const useJournalHistoryStore = create((set) => ({
    ...getDefaultRange(),
    severity: initialSeverity,
    category: initialCategory,
    limit: 100,
    setPeriod: ({ from, to }) => set({ from, to }),
    setLimit: (limit) => set({ limit }),
    toggleSeverity: (severity) =>
        set((state) => {
            const next = new Set(state.severity);
            if (next.has(severity)) next.delete(severity);
            else next.add(severity);
            return { severity: next };
        }),
    toggleCategory: (category) =>
        set((state) => {
            const next = new Set(state.category);
            if (next.has(category)) next.delete(category);
            else next.add(category);
            return { category: next };
        }),
}));
