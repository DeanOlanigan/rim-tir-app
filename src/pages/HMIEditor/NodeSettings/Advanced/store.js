import { create } from "zustand";

export const useAdvancedSettingsUi = create((set) => ({
    ruleType: "map",
    setRuleType: (type) => set(() => ({ ruleType: type })),
}));
