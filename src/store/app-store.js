import { create } from "zustand";

export const useAppStore = create((set, get) => ({
    fullScreenMode: false,
    sideBarCollapsed: false,
    toggleFullScreenMode: () => {
        set({ fullScreenMode: !get().fullScreenMode });
    },
    toggleSideBarCollapsed: () => {
        set({ sideBarCollapsed: !get().sideBarCollapsed });
    },
}));
