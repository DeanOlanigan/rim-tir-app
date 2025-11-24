import { useActionsStore } from "../../store/actions-store";
import { useNodeStore } from "../../store/node-store";

export function getApi({
    canvasRef,
    selectionBoxRef,
    transformerRef,
    overviewLayerRef,
    nodesLayerRef,
}) {
    const getStage = () => canvasRef.current;
    const getSelectionBox = () => selectionBoxRef.current;
    const getTransformer = () => transformerRef.current;
    const getOverviewLayer = () => overviewLayerRef.current;
    const getNodesLayer = () => nodesLayerRef.current;
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

    return {
        getStage,
        getSelectionBox,
        getTransformer,
        getOverviewLayer,
        getNodesLayer,
        getSelectedIds,
        setSelectedIds,
        addNode,
        getGrid,
        getWorkSize,
    };
}
