import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
    isPaused: false,
    isLogTextWrapped: false,
    logTextSize: 14,
    filter: ["WARNING", "ERROR", "INFO"],
    chosenLog: null,
    logRowsCount: 1000,
};

export const useLogStore = create(
    persist(
        (set) => ({
            ...initialState,

            togglePaused: () => set((state) => ({ isPaused: !state.isPaused })),
            toggleLogTextWrapped: () =>
                set((state) => ({
                    isLogTextWrapped: !state.isLogTextWrapped,
                })),

            incLogTextSize: () =>
                set((state) => ({ logTextSize: state.logTextSize + 1 })),
            decLogTextSize: () =>
                set((state) => ({ logTextSize: state.logTextSize - 1 })),

            setFilter: (value) => set({ filter: value }),
            setChosenLog: (chosenLog) => set({ chosenLog }),
            setLogRowsCount: (logRowsCount) => set({ logRowsCount }),
        }),
        {
            name: "log-store",
        }
    )
);

export const useHasChosenLog = () =>
    useLogStore((state) => state.chosenLog?.value && state.chosenLog?.category);
