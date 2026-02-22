import { create } from "zustand";
import { ACTIONS } from "../constants";
import { devtools } from "zustand/middleware";

export const useActionsStore = create(
    devtools(
        (set) => ({
            currentAction: ACTIONS.select,
            prevAction: ACTIONS.select,
            gridSize: 1,
            showGrid: true,
            snapToGrid: false,
            scale: 1,
            gridColor: "#9b9b9bff",
            debugMode: false,
            showNodesTree: true,
            showHitRegions: false,
            showStartCoordMarker: true,
            viewOnlyMode: true,
            isLiveUpdate: false,
            showPagesList: true,
            isUiExpanded: false,
            canvasSize: { width: 0, height: 0 },
            showRulers: true,
            lockTool: false,

            setCurrentAction: (action) =>
                set({ currentAction: action }, undefined, "setCurrentAction"),
            setPrevAction: (action) =>
                set({ prevAction: action }, undefined, "setPrevAction"),

            setGridSize: (size) =>
                set({ gridSize: size }, undefined, "setGridSize"),
            setShowGrid: (show) =>
                set({ showGrid: show }, undefined, "setShowGrid"),
            setSnapToGrid: (snapToGrid) =>
                set({ snapToGrid }, undefined, "setSnap"),
            setScale: (scale) => set({ scale }, undefined, "setScale"),
            setGridColor: (color) =>
                set({ gridColor: color }, undefined, "setGridColor"),
            setDebugMode: (mode) =>
                set({ debugMode: mode }, undefined, "setDebugMode"),
            setShowNodesTree: (show) =>
                set({ showNodesTree: show }, undefined, "setShowNodesTree"),
            setShowHitRegions: (show) =>
                set({ showHitRegions: show }, undefined, "setShowHitRegions"),
            setShowStartCoordMarker: (show) =>
                set(
                    { showStartCoordMarker: show },
                    undefined,
                    "setShowStartCoordMarker",
                ),
            setViewOnlyMode: (mode) => {
                set({ viewOnlyMode: mode }, undefined, "setViewOnlyMode");
            },
            setLiveUpdates: (mode) =>
                set({ isLiveUpdate: mode }, undefined, "setLiveUpdates"),
            setShowPagesList: (mode) =>
                set({ showPagesList: mode }, undefined, "setShowPagesList"),
            setIsUiExpanded: (mode) =>
                set({ isUiExpanded: mode }, undefined, "setIsUiExpanded"),
            setCanvasSize: (size) =>
                set({ canvasSize: size }, undefined, "setCanvasSize"),
            setShowRulers: (mode) =>
                set({ showRulers: mode }, undefined, "setShowRulers"),
            toggleLockTool: () =>
                set(
                    (s) => ({ lockTool: !s.lockTool }),
                    undefined,
                    "toggleLockTool",
                ),
        }),
        {
            name: "actions-store",
        },
    ),
);
