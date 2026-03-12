import { create } from "zustand";

const archiveInitialState = {
    isArchive: true,
    startDate: Date.now() - 86400000,
    endDate: Date.now(),
    stringsQuantity: { value: ["50"] },
    location: { value: ["sd"] },
};

const initialSelectedGroups = new Set([
    "state",
    "danger",
    "warn",
    "noGroup",
    "pause",
    "resume",
]);

const initialSelectedMessages = new Set([
    "error",
    "warn",
    "info",
    "pause",
    "resume",
]);

export const useFilterStore = create((set) => ({
    selectedGroups: initialSelectedGroups,
    selectedMessages: initialSelectedMessages,
    tableColumnsZus: [
        "type",
        "tsText",
        "event",
        "info",
        "group",
        "var",
        "val",
        "desc",
        "user",
        "ackTimeText",
        "who_ack",
        "needAck",
    ],
    ...archiveInitialState,

    setArchive: (data) => set({ isArchive: data }),

    chooseStartDate: (newDate) => set({ startDate: newDate }),
    chooseEndDate: (newDate) => set({ endDate: newDate }),

    setStringQuantity: (newQuantity) =>
        set(() => ({ stringsQuantity: { value: newQuantity } })),

    chooseLocation: (newLocation) =>
        set(() => ({ location: { value: newLocation } })),

    setArchiveInitial: () =>
        set({
            ...archiveInitialState,
            startDate: Date.now() - 86400000,
            endDate: Date.now(),
        }),

    setSelectedGroups: (newGroups) =>
        set({
            selectedGroups:
                newGroups instanceof Set ? newGroups : new Set(newGroups),
        }),

    setSelectedMessages: (newMessages) =>
        set({
            selectedMessages:
                newMessages instanceof Set ? newMessages : new Set(newMessages),
        }),

    toggleGroup: (group) =>
        set((state) => {
            const next = new Set(state.selectedGroups);
            if (next.has(group)) next.delete(group);
            else next.add(group);
            return { selectedGroups: next };
        }),

    toggleMessage: (message) =>
        set((state) => {
            const next = new Set(state.selectedMessages);
            if (next.has(message)) next.delete(message);
            else next.add(message);
            return { selectedMessages: next };
        }),

    setColons: (newColumns) => set({ tableColumnsZus: newColumns }),
}));
