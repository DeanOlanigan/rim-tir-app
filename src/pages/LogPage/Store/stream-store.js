import { create } from "zustand";

export const useLogStream = create((set, get) => ({
    isPaused: false,
    live: [],
    paused: [],

    reset: () => set({ live: [], paused: [], isPaused: false }),
    pause: () =>
        set((state) => ({
            isPaused: true,
            live: [
                ...state.live,
                {
                    epochMs: Date.now(),
                    ts: new Date().toISOString(),
                    level: "status",
                    message: "Поставлено на паузу",
                },
            ],
        })),

    resume: () =>
        set((state) => ({
            isPaused: false,
            live: [
                ...state.live,
                ...state.paused,
                {
                    epochMs: Date.now(),
                    ts: new Date().toISOString(),
                    level: "status",
                    message: "Возобновлено",
                },
            ],
            paused: [],
        })),

    push: (rows) => {
        const { isPaused } = get();
        if (isPaused) {
            set((state) => ({ paused: [...state.paused, ...rows] }));
        } else {
            set((state) => ({ live: [...state.live, ...rows] }));
        }
    },
}));
