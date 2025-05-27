import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useConfigInfoStore = create()(
    persist(
        () => ({
            configInfo: {},
        }),
        {
            name: "config-info-storage",
        }
    )
);
