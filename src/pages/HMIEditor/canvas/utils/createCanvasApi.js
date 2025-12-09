import { useContextMenuStore } from "@/store/contextMenu-store";
import { useActionsStore } from "../../store/actions-store";
import { useNodeStore } from "../../store/node-store";

export function createCanvasApi({
    canvasRef,
    selectionBoxRef,
    transformerRef,
    overviewLayerRef,
    nodesLayerRef,
    nodesRef,
}) {
    const getStage = () => canvasRef.current;
    const getSelectionBox = () => selectionBoxRef.current;
    const getTransformer = () => transformerRef.current;
    const getOverviewLayer = () => overviewLayerRef.current;
    const getNodesLayer = () => nodesLayerRef.current;
    const getNodes = () => nodesRef.current;
    const getSelectedIds = () => useNodeStore.getState().selectedIds;
    const setSelectedIds = (ids) => useNodeStore.getState().setSelectedIds(ids);
    const addNode = (id, patch) => useNodeStore.getState().addNode(id, patch);
    const getGrid = () => {
        const { gridSize, snapToGrid } = useActionsStore.getState();
        return { gridSize, snapToGrid };
    };
    const getWorkSize = () => {
        const size = useActionsStore.getState().size;
        return { workW: size.width, workH: size.height };
    };
    const setCurrentAction = (action) =>
        useActionsStore.getState().setCurrentAction(action);
    const getActiveAction = () => useActionsStore.getState().currentAction;
    const updateContextMenu = (type, data) =>
        useContextMenuStore.getState().updateContext(type, data);

    return {
        getStage,
        getSelectionBox,
        getTransformer,
        getOverviewLayer,
        getNodesLayer,
        getNodes,
        getSelectedIds,
        setSelectedIds,
        addNode,
        getGrid,
        getWorkSize,
        setCurrentAction,
        getActiveAction,
        updateContextMenu,
    };
}
