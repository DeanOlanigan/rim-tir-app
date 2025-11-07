import { create } from "zustand";
import { ACTIONS } from "./actions";

export const useActionsStore = create((set) => ({
    currentAction: ACTIONS.select,
    size: { width: 100, height: 75 },
    gridSize: 1,
    showGrid: true,
    snap: false,
    scale: 1,

    setCurrentAction: (action) => set({ currentAction: action }),

    setSize: (size) => set({ size }),
    setGridSize: (size) => set({ gridSize: size }),
    setShowGrid: (show) => set({ showGrid: show }),
    setSnap: (snap) => set({ snap }),
    setScale: (scale) => set({ scale }),
}));
