import { create } from "zustand";
import { ACTIONS } from "../constants";
import { useNodeStore } from "./node-store";

export const useActionsStore = create((set) => ({
    currentAction: ACTIONS.select,
    prevAction: ACTIONS.select,
    gridSize: 1,
    showGrid: true,
    snapToGrid: false,
    scale: 1,
    backgroundColor: "#254e25ff",
    gridColor: "#9b9b9bff",
    debugMode: true,
    showNodesTree: true,
    showHitRegions: false,
    showStartCoordMarker: true,
    viewOnlyMode: false,
    isLiveUpdate: false,
    showPagesList: true,

    setCurrentAction: (action) => set({ currentAction: action }),
    setPrevAction: (action) => set({ prevAction: action }),

    setGridSize: (size) => set({ gridSize: size }),
    setShowGrid: (show) => set({ showGrid: show }),
    setSnap: (snapToGrid) => set({ snapToGrid }),
    setScale: (scale) => set({ scale }),
    setBackgroundColor: (color) => set({ backgroundColor: color }),
    setGridColor: (color) => set({ gridColor: color }),
    setDebugMode: (mode) => set({ debugMode: mode }),
    setShowNodesTree: (show) => set({ showNodesTree: show }),
    setShowHitRegions: (show) => set({ showHitRegions: show }),
    setShowStartCoordMarker: (show) => set({ showStartCoordMarker: show }),
    setViewOnlyMode: (mode) => {
        useNodeStore.getState().setSelectedIds([]);
        set({ viewOnlyMode: mode });
    },
    setLiveUpdates: (mode) => set({ isLiveUpdate: mode }),
    setShowPagesList: (mode) => set({ showPagesList: mode }),
}));
