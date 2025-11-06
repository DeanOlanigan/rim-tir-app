import { create } from "zustand";

export const useActionsStore = create((set) => ({
    currentAction: "select",

    setCurrentAction: (action) => set({ currentAction: action }),
}));
