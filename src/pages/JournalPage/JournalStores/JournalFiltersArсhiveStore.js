import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
    isArchive: true,
    startDate: Date.now() - 86400000,
    endDate: Date.now(),
    stringsQuantity: { value: ["50"] },
    Location: { value: ["sd"] },
};

export const useJournalFiltersArchiveStore = create(
    persist(
        (set) => ({
            ...initialState,

            setArchive: (data) => set({ isArchive: data }),

            chooseStartDate: (newDate) => set({ startDate: newDate }),
            chooseEndDate: (newDate) => set({ endDate: newDate }),

            setStringQuantity: (newQuantity) =>
                set(() => ({ stringsQuantity: { value: newQuantity } })),

            chooseLocation: (newLocation) =>
                set(() => ({ Location: { value: newLocation } })),

            setInitial: () =>
                set({
                    ...initialState,
                    initialState: {
                        startDate: Date.now() - 86400000,
                        endDate: Date.now(),
                    },
                }),
        }),
        {
            name: "archive-store",
        }
    )
);
