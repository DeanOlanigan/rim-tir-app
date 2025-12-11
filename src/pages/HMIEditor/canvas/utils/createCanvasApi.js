export function createCanvasApi({
    canvasRef,
    selectionBoxRef,
    transformerRef,
    overviewLayerRef,
    nodesLayerRef,
    nodesRef,
    stateApi,
}) {
    const getStage = () => canvasRef.current;
    const getSelectionBox = () => selectionBoxRef.current;
    const getTransformer = () => transformerRef.current;
    const getOverviewLayer = () => overviewLayerRef.current;
    const getNodesLayer = () => nodesLayerRef.current;
    const getNodes = () => nodesRef.current;

    const api = {
        canvas: {
            getStage,
            getSelectionBox,
            getTransformer,
            getOverviewLayer,
            getNodesLayer,
            getNodes,
        },
        selection: {
            getSelectedIds: stateApi.getSelectedIds,
            setSelectedIds: stateApi.setSelectedIds,
        },
        nodes: {
            addNode: stateApi.addNode,
        },
        view: {
            getGrid: stateApi.getGrid,
            getWorkSize: stateApi.getWorkSize,
        },
        tools: {
            getActiveAction: stateApi.getActiveAction,
            setCurrentAction: stateApi.setCurrentAction,
        },
        ui: {
            updateContextMenu: stateApi.updateContextMenu,
        },
    };
    api.getStage = api.canvas.getStage;
    api.getSelectionBox = api.canvas.getSelectionBox;
    api.getTransformer = api.canvas.getTransformer;
    api.getOverviewLayer = api.canvas.getOverviewLayer;
    api.getNodesLayer = api.canvas.getNodesLayer;
    api.getNodes = api.canvas.getNodes;
    api.getSelectedIds = api.selection.getSelectedIds;
    api.setSelectedIds = api.selection.setSelectedIds;
    api.addNode = api.nodes.addNode;
    api.getGrid = api.view.getGrid;
    api.getWorkSize = api.view.getWorkSize;
    api.getActiveAction = api.tools.getActiveAction;
    api.setCurrentAction = api.tools.setCurrentAction;
    api.updateContextMenu = api.ui.updateContextMenu;

    return api;
}
