import { create } from "zustand";
import { ACTIONS } from "../constants";

export const useActionsStore = create((set) => ({
    currentAction: ACTIONS.select,
    prevAction: ACTIONS.select,
    gridSize: 1,
    showGrid: true,
    snapToGrid: false,
    scale: 1,
    clampToArea: false,
    backgroundColor: "#254e25ff",
    workAreaColor: "#ffdadaff",
    gridColor: "#9b9b9bff",
    debugMode: true,
    showNodesTree: true,
    showHitRegions: false,
    showStartCoordMarker: true,
    viewOnlyMode: false,

    setCurrentAction: (action) => set({ currentAction: action }),
    setPrevAction: (action) => set({ prevAction: action }),

    setGridSize: (size) => set({ gridSize: size }),
    setShowGrid: (show) => set({ showGrid: show }),
    setSnap: (snapToGrid) => set({ snapToGrid }),
    setScale: (scale) => set({ scale }),
    setClampToArea: (clamp) => set({ clampToArea: clamp }),
    setBackgroundColor: (color) => set({ backgroundColor: color }),
    setWorkAreaColor: (color) => set({ workAreaColor: color }),
    setGridColor: (color) => set({ gridColor: color }),
    setDebugMode: (mode) => set({ debugMode: mode }),
    setShowNodesTree: (show) => set({ showNodesTree: show }),
    setShowHitRegions: (show) => set({ showHitRegions: show }),
    setShowStartCoordMarker: (show) => set({ showStartCoordMarker: show }),
    setViewOnlyMode: (mode) => set({ viewOnlyMode: mode }),
}));
