import { create } from "zustand";

export const useAppStore = create((set, get) => ({
    fullScreenMode: false,
    toggleFullScreenMode: () => {
        set({ fullScreenMode: !get().fullScreenMode });
    },
}));
