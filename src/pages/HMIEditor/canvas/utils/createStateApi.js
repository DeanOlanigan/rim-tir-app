export function createStateApi(nodeStore, actionsStore, contextMenuStore) {
    const getSelectedIds = () => nodeStore.getState().selectedIds;
    const setSelectedIds = (ids) => nodeStore.getState().setSelectedIds(ids);
    const addNode = (id, patch) => nodeStore.getState().addNode(id, patch);
    const getGrid = () => {
        const { gridSize, snapToGrid } = actionsStore.getState();
        return { gridSize, snapToGrid };
    };
    const getWorkSize = () => {
        const size = actionsStore.getState().size;
        return { workW: size.width, workH: size.height };
    };
    const setCurrentAction = (action) =>
        actionsStore.getState().setCurrentAction(action);
    const getActiveAction = () => actionsStore.getState().currentAction;
    const setTempAction = (action) =>
        actionsStore.getState().setTempAction(action);
    const updateContextMenu = (type, data) =>
        contextMenuStore.getState().updateContext(type, data);

    return {
        getSelectedIds,
        setSelectedIds,
        addNode,
        getGrid,
        getWorkSize,
        setCurrentAction,
        getActiveAction,
        setTempAction,
        updateContextMenu,
    };
}
