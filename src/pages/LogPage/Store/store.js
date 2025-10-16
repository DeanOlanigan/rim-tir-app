import { LOG_LEVELS } from "@/config/constants";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
    isLogTextWrapped: false,
    logTextSize: 14,
    filter: [
        LOG_LEVELS.error,
        LOG_LEVELS.warn,
        LOG_LEVELS.info,
        LOG_LEVELS.status,
    ],
    chosenLog: null,
    logRowsCount: 1000,
    logsToDwnl: [],
};

export const useLogStore = create(
    persist(
        (set) => ({
            ...initialState,

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
            setLogsToDwnl: (logsToDwnl) => set({ logsToDwnl }),
        }),
        {
            name: "log-store",
        }
    )
);

export const useHasChosenLog = () =>
    useLogStore((state) => state.chosenLog?.value && state.chosenLog?.category);
