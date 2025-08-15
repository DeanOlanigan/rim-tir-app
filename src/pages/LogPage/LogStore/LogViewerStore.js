import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLogViewerStore = create(
    persist(
        (set) => ({

            isPaused: false,
            isLogTextWrapped: localStorage.getItem("user-settings")?.isLogTextWrapped || false,
            logTextSize: localStorage.getItem("user-settings")?.logTextSize || 14,
            currentFilter: {
                WARNING: true,
                ERROR: true,
                INFO: true,    
            },

            logs: [],
            pausedLogs: [],
            
            setIsPausedZus: (isPaused) => {
                if (isPaused) {
                    set(state => ({
                        isPaused: true,
                        logs: [...state.logs, { severity: "STATUS", message: "Paused" }]
                    }));
                } else {
                    set(state => ({
                        isPaused: false,
                        logs: [
                            ...state.logs,
                            ...state.pausedLogs,
                            { severity: "STATUS", message: "Resumed" }
                        ],
                        pausedLogs: []
                    }));
                }
            },

            toggleWrapZus: () => set(state => ({
                isLogTextWrapped: !state.isLogTextWrapped
            })),

            setLogTextSizeZus: (logTextSize) => set({ logTextSize }),

            setCurrentFilterZus: (currentFilter) => set({ currentFilter }),

            setLogsZus: (logs) => set(state => {
                if (state.isPaused) {
                    return {
                        pausedLogs: [...state.pausedLogs, ...logs]
                    };
                }
                return {
                    logs: [...state.logs, ...logs]
                };
            }),

            clearLogsZus: () => set({ logs: [], pausedLogs: [] })
        }),
        {
            name: "log-viewer-store",
            partialize: (state) => Object.fromEntries(
                Object.entries(state).filter(
                    ([key]) => !["logs", "pausedLogs", "currentFilter"].includes(key)
                )
            )
        }
    )
);

const unsubscribe = useLogViewerStore.subscribe(
    (state) => {
        const settings = {
            isLogTextWrapped: state.isLogTextWrapped,
            logTextSize: state.logTextSize,
        };
        localStorage.setItem("user-settings", JSON.stringify(settings));
    },
    (state) => [state.isLogTextWrapped, state.logTextSize]
);

export default useLogViewerStore;