import { unindexNodesCOW } from "../bindings";

/**
 * Сборка ответа и разиндексация удаленных групп
 */
export function createUngroupPatch({
    state,
    pageId,
    page,
    newNodes,
    newRootIds,
    deletedGroupIds,
    nextSelection,
}) {
    const { varIndex, nodeIndex } = unindexNodesCOW({
        baseNodeIndex: state.nodeIndex,
        baseVarIndex: state.varIndex,
        varIndex: state.varIndex,
        nodeIndex: state.nodeIndex,
        nodeIds: deletedGroupIds,
    });

    return {
        patch: {
            nodes: newNodes,
            varIndex,
            nodeIndex,
            pages: {
                ...state.pages,
                [pageId]: {
                    ...page,
                    rootIds: newRootIds,
                },
            },
        },
        dirty: true,
        tree: true,
        selection: "set",
        selectedIds: nextSelection,
    };
}
