import { create } from "zustand";
import { ACTIONS } from "../constants";
import { useNodeStore } from "./node-store";
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
            backgroundColor: "#254e25ff",
            gridColor: "#9b9b9bff",
            debugMode: true,
            showNodesTree: true,
            showHitRegions: false,
            showStartCoordMarker: true,
            viewOnlyMode: true,
            isLiveUpdate: false,
            showPagesList: true,
            isUiExpanded: false,
            canvasSize: { width: 0, height: 0 },

            setCurrentAction: (action) =>
                set({ currentAction: action }, undefined, "setCurrentAction"),
            setPrevAction: (action) =>
                set({ prevAction: action }, undefined, "setPrevAction"),

            setGridSize: (size) =>
                set({ gridSize: size }, undefined, "setGridSize"),
            setShowGrid: (show) =>
                set({ showGrid: show }, undefined, "setShowGrid"),
            setSnap: (snapToGrid) => set({ snapToGrid }, undefined, "setSnap"),
            setScale: (scale) => set({ scale }, undefined, "setScale"),
            setBackgroundColor: (color) =>
                set(
                    { backgroundColor: color },
                    undefined,
                    "setBackgroundColor",
                ),
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
                useNodeStore.getState().setSelectedIds([]);
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
        }),
        {
            name: "actions-store",
        },
    ),
);
