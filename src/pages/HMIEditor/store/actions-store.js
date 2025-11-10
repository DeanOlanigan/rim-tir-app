import { create } from "zustand";
import { ACTIONS } from "./actions";

export const useActionsStore = create((set) => ({
    currentAction: ACTIONS.select,
    size: { width: 100, height: 75 },
    gridSize: 1,
    showGrid: true,
    snap: false,
    scale: 1,
    clampToArea: true,
    backgroundColor: "#bffcbaff",
    workAreaColor: "#ffdadaff",
    gridColor: "#7687d1ff",

    setCurrentAction: (action) => set({ currentAction: action }),

    setSize: (size) => set({ size }),
    setGridSize: (size) => set({ gridSize: size }),
    setShowGrid: (show) => set({ showGrid: show }),
    setSnap: (snap) => set({ snap }),
    setScale: (scale) => set({ scale }),
    setClampToArea: (clamp) => set({ clampToArea: clamp }),
    setBackgroundColor: (color) => set({ backgroundColor: color }),
    setWorkAreaColor: (color) => set({ workAreaColor: color }),
    setGridColor: (color) => set({ gridColor: color }),
}));
