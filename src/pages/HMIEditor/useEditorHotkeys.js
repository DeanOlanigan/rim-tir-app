import { useHotkeys } from "react-hotkeys-hook";
import { useActionsStore } from "./store/actions-store";
import { OPEN_PROJECT_DIALOG_ID, openProjectDialog } from "./ProjectManager";
import { ACTIONS } from "./constants";
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
    useHotkeys("v", () => tools.manager.setActive(ACTIONS.select));
    useHotkeys("h", () => tools.manager.setActive(ACTIONS.hand));
    useHotkeys("r", () => tools.manager.setActive(ACTIONS.square));
    useHotkeys("l", () => tools.manager.setActive(ACTIONS.line));
    useHotkeys("shift+l", () => tools.manager.setActive(ACTIONS.arrow));
    useHotkeys("t", () => tools.manager.setActive(ACTIONS.text));
    // Toggle grid
    useHotkeys("shift+g", () =>
        useActionsStore
            .getState()
            .setShowGrid(!useActionsStore.getState().showGrid),
    );
    // Open project
    useHotkeys(
        "ctrl+p",
        () => openProjectDialog.open(OPEN_PROJECT_DIALOG_ID, { tools }),
        { preventDefault: true },
    );
    // Toggle view only
    useHotkeys("shift+v", () =>
        useActionsStore
            .getState()
            .setViewOnlyMode(!useActionsStore.getState().viewOnlyMode),
    );
    // Zoom
    useHotkeys(
        "ctrl+equal, ctrl+add",
        () => zoomByPercent(tools.api.getStage(), 1),
        { preventDefault: true },
    );
    useHotkeys(
        "ctrl+minus, ctrl+subtract",
        () => zoomByPercent(tools.api.getStage(), -1),
        { preventDefault: true },
    );
    useHotkeys("ctrl+0", () => setZoom(tools.api.getStage(), 1));
    useHotkeys("shift+1", () => fitToFrame());
    useHotkeys("shift+2", () => console.log("Zoom to selection"));
    // Delete
    useHotkeys("backspace, delete", () => {
        const store = useNodeStore.getState();
        if (store.selectedIds.length === 0) return;
        store.removeNodes(store.selectedIds);
    });
    // Duplicate
    useHotkeys(
        "ctrl+d",
        () => {
            const store = useNodeStore.getState();
            if (store.selectedIds.length === 0) return;
            store.duplicateNodes(store.selectedIds);
        },
        { preventDefault: true },
    );
    // Layer
    useHotkeys("bracketright", () => {
        const store = useNodeStore.getState();
        layerShift(store.selectedIds, "moveToTop");
    });
    useHotkeys("bracketleft", () => {
        const store = useNodeStore.getState();
        layerShift(store.selectedIds, "moveToBottom");
    });
    useHotkeys("ctrl+bracketright", () => {
        const store = useNodeStore.getState();
        layerShift(store.selectedIds, "moveDown");
    });
    useHotkeys("ctrl+bracketleft", () => {
        const store = useNodeStore.getState();
        layerShift(store.selectedIds, "moveUp");
    });
    // Minimize UI
    useHotkeys("ctrl+shift+backslash", () => {
        const viewOnlyMode = useActionsStore.getState().viewOnlyMode;
        if (viewOnlyMode) return;
        useActionsStore
            .getState()
            .setIsUiExpanded(!useActionsStore.getState().isUiExpanded);
    });
    // Pages
    useHotkeys("pagedown", () => {
        const activePageId = useNodeStore.getState().activePageId;
        const pages = useNodeStore.getState().pages;
        const pageIds = Object.keys(pages);
        const nextIndex = pageIds.indexOf(activePageId) + 1;
        if (nextIndex >= pageIds.length) return;
        useNodeStore.getState().setActivePage(pageIds[nextIndex]);
    });
    useHotkeys("pageup", () => {
        const activePageId = useNodeStore.getState().activePageId;
        const pages = useNodeStore.getState().pages;
        const pageIds = Object.keys(pages);
        const nextIndex = pageIds.indexOf(activePageId) - 1;
        if (nextIndex < 0) return;
        useNodeStore.getState().setActivePage(pageIds[nextIndex]);
    });
    // Selection
    useHotkeys(
        "ctrl+a",
        () => {
            const store = useNodeStore.getState();
            store.setSelectedIds(
                store.pages[store.activePageId]?.rootIds || [],
            );
        },
        { preventDefault: true },
    );
    useHotkeys("esc", () => {
        const store = useNodeStore.getState();
        store.setSelectedIds([]);
    });
    // Group
    useHotkeys(
        "ctrl+g",
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
        "ctrl+shift+g",
        () => {
            const store = useNodeStore.getState();
            if (store.selectedIds.length === 0) return;
            store.ungroupMultipleNodes(store.selectedIds);
        },
        { preventDefault: true },
    );
}
