import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create(
    persist(
        (set, get) => ({
            fullScreenMode: false,
            sideBarCollapsed: false,
            toggleFullScreenMode: () => {
                set({ fullScreenMode: !get().fullScreenMode });
            },
            toggleSideBarCollapsed: () => {
                set({ sideBarCollapsed: !get().sideBarCollapsed });
            },
        }),
        {
            name: "app-storage",
            partialize: (state) => ({
                sideBarCollapsed: state.sideBarCollapsed,
            }),
        },
    ),
);
