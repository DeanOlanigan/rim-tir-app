import { duplicateSubtrees } from "../utils/nodes";
import { indexSubtree } from "./indexSubtreeService";

export function duplicateNodesService(state, ids) {
    const pageId = state.activePageId;
    const page = state.pages[pageId];
    if (!page) return state;

    const result = duplicateSubtrees(state.nodes, ids);

    const updatedPage = {
        ...page,
        rootIds: [...page.rootIds, ...result.rootIds],
    };

    const newIndex = { ...state.varIndex };

    result.rootIds.forEach((id) => {
        indexSubtree(newIndex, result.nodes, id);
    });

    return {
        nodes: result.nodes,
        pages: {
            ...state.pages,
            [pageId]: updatedPage,
        },
        activePageId: pageId,
        selectedIds: result.selectedIds,
        varIndex: newIndex,
    };
}
