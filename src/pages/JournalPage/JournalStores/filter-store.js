import { create } from "zustand";

const initialCategoryFilter = new Set([
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

const initialSelectedMessages = new Set([
    "error",
    "warning",
    "info",
    "critical",
]);

function toggleSet(state, value, set) {
    const next = new Set(state[set]);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return { [set]: next };
}

export const useFilterStore = create((set) => ({
    selectedMessages: initialSelectedMessages,
    selectedCategory: initialCategoryFilter,

    toggleMessage: (message) =>
        set((state) => toggleSet(state, message, "selectedMessages")),

    toggleCategory: (category) =>
        set((state) => toggleSet(state, category, "selectedCategory")),
}));
