import { create } from "zustand";

const ArchiveInitialState = {
    isArchive: true,
    startDate: Date.now() - 86400000,
    endDate: Date.now(),
    stringsQuantity: { value: ["50"] },
    Location: { value: ["sd"] },
};

export const useFilterStore = create(
    (set) => ({
        selectedGroups: [
            "Состояние",
            "Аварийная",
            "Предупредительная",
            "Без Группы",
            "Пауза",
            "Возобновлен",
        ],

        ...ArchiveInitialState,

        setArchive: (data) => set({ isArchive: data }),

        chooseStartDate: (newDate) => set({ startDate: newDate }),
        chooseEndDate: (newDate) => set({ endDate: newDate }),

        setStringQuantity: (newQuantity) =>
            set(() => ({ stringsQuantity: { value: newQuantity } })),

        chooseLocation: (newLocation) =>
            set(() => ({ Location: { value: newLocation } })),

        setArchiveInitial: () =>
            set({
                ...ArchiveInitialState,
                initialState: {
                    startDate: Date.now() - 86400000,
                    endDate: Date.now(),
                },
            }),
        
        tableColumnsZus: ["date", "type", "group", "var", "val", "desc"],

        selectedMessages: ["ТС", "ТУ", "Пауза", "Старт"],

        setSelectedGroups: (newGroups) =>
            set({ selectedGroups: newGroups }),
        
        setSelectedMessages: (newMessages) =>
            set({ selectedMessages: newMessages }),

        setColons: (newColumns) => set({ tableColumnsZus: newColumns }),
    }),
);
