import { useHotkeys } from "react-hotkeys-hook";
import { useActionsStore } from "../store/actions-store";
import { OPEN_PROJECT_DIALOG_ID, openProjectDialog } from "../ProjectManager";
import { ACTIONS, HOTKEYS, LAYERS_OPS } from "../constants";
import { setZoom, zoomByPercent } from "../canvas/utils/zoomService";
import { useNodeStore } from "../store/node-store";
import { calcBBox, fitNodesToFrame } from "../utils";
import { EDIT_GRID_DIALOG_ID, editGridDialog } from "../editGridDialog";
import { flyToNode } from "../utils/flyToNode";
import { useRef } from "react";
import {
    copySelection,
    cutSelection,
    getPasteData,
    pasteFromClipboard,
} from "../actions/clipboardActions";
import { toggleViewOnlyModeAction } from "../actions/toggleViewOnlyModeAction";

export function useEditorHotkeys(tools) {
    const hotkeyTweenRef = useRef(null);
    // Switch tools
    useHotkeys(HOTKEYS.selectTool.hotkey, () =>
        tools.manager.setActive(ACTIONS.select),
    );
    useHotkeys(HOTKEYS.handTool.hotkey, () =>
        tools.manager.setActive(ACTIONS.hand),
    );
    useHotkeys(HOTKEYS.squareTool.hotkey, () =>
        tools.manager.setActive(ACTIONS.square),
    );
    useHotkeys(HOTKEYS.lineTool.hotkey, () =>
        tools.manager.setActive(ACTIONS.line),
    );
    useHotkeys(HOTKEYS.arrowTool.hotkey, () =>
        tools.manager.setActive(ACTIONS.arrow),
    );
    useHotkeys(HOTKEYS.textTool.hotkey, () =>
        tools.manager.setActive(ACTIONS.text),
    );
    // Toggle grid
    useHotkeys(HOTKEYS.toggleGrid.hotkey, () =>
        useActionsStore
            .getState()
            .setShowGrid(!useActionsStore.getState().showGrid),
    );
    useHotkeys(HOTKEYS.snapToGrid.hotkey, () => {
        useActionsStore
            .getState()
            .setSnapToGrid(!useActionsStore.getState().snapToGrid);
    });
    useHotkeys(HOTKEYS.openGridDialog.hotkey, () =>
        editGridDialog.open(EDIT_GRID_DIALOG_ID),
    );
    // Open project
    useHotkeys(
        HOTKEYS.openProject.hotkey,
        () => openProjectDialog.open(OPEN_PROJECT_DIALOG_ID, { tools }),
        { preventDefault: true },
    );
    // Toggle view only
    useHotkeys(HOTKEYS.toggleViewOnly.hotkey, () =>
        toggleViewOnlyModeAction(tools),
    );
    // Zoom
    useHotkeys(
        HOTKEYS.zoomPlus.hotkey,
        () => zoomByPercent(tools.api.getStage(), 1),
        { preventDefault: true },
    );
    useHotkeys(
        HOTKEYS.zoomMinus.hotkey,
        () => zoomByPercent(tools.api.getStage(), -1),
        { preventDefault: true },
    );
    useHotkeys(HOTKEYS.zoomReset.hotkey, () =>
        setZoom(tools.api.getStage(), 1),
    );
    useHotkeys(HOTKEYS.fitToFrame.hotkey, () =>
        fitNodesToFrame(tools.canvasRef, tools.nodesRef),
    );
    useHotkeys(HOTKEYS.zoomToSelection.hotkey, () => {
        const stage = tools.api.getStage();
        const selectedIds = useNodeStore.getState().selectedIds;
        const konvaNodes = tools.nodesRef.current;
        if (selectedIds.length === 0 || !konvaNodes) return;
        const selectedNodes = selectedIds.map((id) => konvaNodes.get(id));
        flyToNode(stage, selectedNodes, {
            hotkeyTweenRef,
            zoomToFit: true,
            duration: 0.35,
        });
    });
    // Delete
    useHotkeys(HOTKEYS.delete.hotkey, () => {
        const store = useNodeStore.getState();
        if (store.selectedIds.length === 0) return;
        store.removeNodes(store.selectedIds);
    });
    // Duplicate
    useHotkeys(
        HOTKEYS.duplicate.hotkey,
        () => {
            const store = useNodeStore.getState();
            if (store.selectedIds.length === 0) return;
            store.duplicateNodes(store.selectedIds);
        },
        { preventDefault: true },
    );
    // Layer
    useHotkeys(HOTKEYS.moveToTop.hotkey, () => {
        const store = useNodeStore.getState();
        useNodeStore
            .getState()
            .reorderLayers(store.selectedIds, LAYERS_OPS.moveToTop);
    });
    useHotkeys(HOTKEYS.moveToBottom.hotkey, () => {
        const store = useNodeStore.getState();
        useNodeStore
            .getState()
            .reorderLayers(store.selectedIds, LAYERS_OPS.moveToBottom);
    });
    useHotkeys(HOTKEYS.moveDown.hotkey, () => {
        const store = useNodeStore.getState();
        useNodeStore
            .getState()
            .reorderLayers(store.selectedIds, LAYERS_OPS.moveDown);
    });
    useHotkeys(HOTKEYS.moveUp.hotkey, () => {
        const store = useNodeStore.getState();
        useNodeStore
            .getState()
            .reorderLayers(store.selectedIds, LAYERS_OPS.moveUp);
    });
    // Minimize UI
    useHotkeys(HOTKEYS.minimizeUi.hotkey, () => {
        const viewOnlyMode = useActionsStore.getState().viewOnlyMode;
        if (viewOnlyMode) return;
        useActionsStore
            .getState()
            .setIsUiExpanded(!useActionsStore.getState().isUiExpanded);
    });
    // Pages
    useHotkeys(HOTKEYS.pageDown.hotkey, () => {
        const activePageId = useNodeStore.getState().activePageId;
        const pages = useNodeStore.getState().pages;
        const pageIds = Object.keys(pages);
        const nextIndex = pageIds.indexOf(activePageId) + 1;
        if (nextIndex >= pageIds.length) return;
        useNodeStore.getState().setActivePage(pageIds[nextIndex]);
    });
    useHotkeys(HOTKEYS.pageUp.hotkey, () => {
        const activePageId = useNodeStore.getState().activePageId;
        const pages = useNodeStore.getState().pages;
        const pageIds = Object.keys(pages);
        const nextIndex = pageIds.indexOf(activePageId) - 1;
        if (nextIndex < 0) return;
        useNodeStore.getState().setActivePage(pageIds[nextIndex]);
    });
    // Selection
    useHotkeys(
        HOTKEYS.selectAll.hotkey,
        () => {
            const store = useNodeStore.getState();
            store.setSelectedIds(
                store.pages[store.activePageId]?.rootIds || [],
            );
        },
        { preventDefault: true },
    );
    useHotkeys(HOTKEYS.deselectAll.hotkey, () => {
        const store = useNodeStore.getState();
        store.setSelectedIds([]);
    });
    // Group
    useHotkeys(
        HOTKEYS.group.hotkey,
        () => {
            const stage = tools.api.getStage();
            const store = useNodeStore.getState();
            if (store.selectedIds.length === 0 || !stage) return;
            const gcl = store.selectedIds.map((id) =>
                tools.api
                    .getNodes()
                    .get(id)
                    .getClientRect({ relativeTo: stage }),
            );
            const bbox = calcBBox(gcl);
            store.groupNodes(store.selectedIds, bbox);
        },
        { preventDefault: true },
    );
    useHotkeys(
        HOTKEYS.ungroup.hotkey,
        () => {
            const store = useNodeStore.getState();
            if (store.selectedIds.length === 0) return;
            store.ungroupNodes(store.selectedIds);
        },
        { preventDefault: true },
    );
    useHotkeys(HOTKEYS.copy.hotkey, async () => {
        await copySelection(useNodeStore.getState());
    });
    useHotkeys(HOTKEYS.cut.hotkey, async () => {
        await cutSelection(useNodeStore.getState());
    });
    useHotkeys(HOTKEYS.paste.hotkey, () => {
        const { store, worldX, worldY, gridSize } = getPasteData(tools);
        pasteFromClipboard(store, {
            worldX,
            worldY,
            gridSize,
        });
    });
}
