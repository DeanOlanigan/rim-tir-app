import { useHotkeys } from "react-hotkeys-hook";
import { useActionsStore } from "./store/actions-store";
import { OPEN_PROJECT_DIALOG_ID, openProjectDialog } from "./ProjectManager";
import { ACTIONS, HOTKEYS } from "./constants";
import { setZoom, zoomByPercent } from "./canvas/utils/zoomService";
import { useNodeStore } from "./store/node-store";
import { calcBBox, layerShift } from "./utils";
import { useFitToFrame } from "./canvas/hooks/useFitToFrame";

export function useEditorHotkeys(tools) {
    const fitToFrame = useFitToFrame({
        canvasRef: tools.canvasRef,
        auto: false,
        nodesRef: tools.nodesRef,
    });
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
    // Open project
    useHotkeys(
        HOTKEYS.openProject.hotkey,
        () => openProjectDialog.open(OPEN_PROJECT_DIALOG_ID, { tools }),
        { preventDefault: true },
    );
    // Toggle view only
    useHotkeys(HOTKEYS.toggleViewOnly.hotkey, () =>
        useActionsStore
            .getState()
            .setViewOnlyMode(!useActionsStore.getState().viewOnlyMode),
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
    useHotkeys(HOTKEYS.fitToFrame.hotkey, () => fitToFrame());
    useHotkeys(HOTKEYS.zoomToSelection.hotkey, () =>
        console.log("Zoom to selection"),
    );
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
        layerShift(store.selectedIds, "moveToTop");
    });
    useHotkeys(HOTKEYS.moveToBottom.hotkey, () => {
        const store = useNodeStore.getState();
        layerShift(store.selectedIds, "moveToBottom");
    });
    useHotkeys(HOTKEYS.moveDown.hotkey, () => {
        const store = useNodeStore.getState();
        layerShift(store.selectedIds, "moveDown");
    });
    useHotkeys(HOTKEYS.moveUp.hotkey, () => {
        const store = useNodeStore.getState();
        layerShift(store.selectedIds, "moveUp");
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
            store.ungroupMultipleNodes(store.selectedIds);
        },
        { preventDefault: true },
    );
}
