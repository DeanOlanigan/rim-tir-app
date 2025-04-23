import { create } from "zustand";

export const useMonitoringStore = create()((set) => ({
    valuesMap: {},

    setValuesMap: (data) => set({ valuesMap: data }),
}));
