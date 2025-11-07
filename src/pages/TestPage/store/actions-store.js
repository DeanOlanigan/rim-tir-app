import { create } from "zustand";
import { ACTIONS } from "./actions";

export const useActionsStore = create((set) => ({
    currentAction: ACTIONS.select,
    size: { width: 100, height: 75 },
    gridSize: 1,
    showGrid: false,
    snap: false,

    setCurrentAction: (action) => set({ currentAction: action }),

    setSize: (size) => set({ size }),
    setGridSize: (size) => set({ gridSize: size }),
    setShowGrid: (show) => set({ showGrid: show }),
    setSnap: (snap) => set({ snap }),
}));
