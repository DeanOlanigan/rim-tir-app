import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLogStore = create(
    persist(
        (set, get) => ({
            logDataZus: {
                logNameZus: "",
                logSizeZus: 0,
                logCreationDateZus: "",
                logTypeZus: "",
                logRowsZus: JSON.parse(localStorage.getItem("user-settings"))?.logRows || "500",
            },

            hasChosenLogZus: Boolean(localStorage.getItem("chosenLog")),

            initializeZus: () => {
                const chosenLog = localStorage.getItem("chosenLog");
                if (chosenLog) {
                    set({
                        logDataZus: JSON.parse(chosenLog),
                        hasChosenLogZus: true,
                    });
                }
            },

            updateLogDataZus: (data) => set(state => 
                ({
                    logDataZus: {...state.logDataZus, ...data}
                })),

            saveChosenLogZus: () => {
                localStorage.setItem("chosenLog", JSON.stringify(get().logDataZus));
                set({ hasChosenLogZus: true });
            },

            removeChosenLog: () => {
                localStorage.removeItem("chosenLog");
                set ({ hasChosenLogZus: false });
            }

        }),
        {
            name: "log-storage",
            partialize: (state) => Object.fromEntries(
                Object.entries(state).filter(
                    ([key]) => !["logDataZus.name", "logDataZus.rows", "logDataZus.size", "logDataZus.type", "logFiltersZus"].includes(key)
                )
            )
        }

    )
);