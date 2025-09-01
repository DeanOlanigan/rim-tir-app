import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useMonitoringStore = create(
    devtools((set) => ({
        settings: {},

        setSettings: (data) =>
            set((state) => {
                const newSettings = { ...state.settings };
                for (const item of data) newSettings[item.id].value = item.data;
                return { settings: newSettings };
            }),
    }))
);
