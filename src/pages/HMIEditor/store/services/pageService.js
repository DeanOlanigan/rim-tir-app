// src\pages\HMIEditor\store\services\page-service.js
import { rebuildVarIndexFromNodes } from "../utils/bindings";
import { removeNodesByIds } from "../utils/nodes";
import {
    createDefaultPage,
    getPageNodeIds,
    removePageById,
    resolveNextPageIdAfterRemoval,
} from "../utils/pages";

export function removePageService(state, pageId) {
    const page = state.pages[pageId];
    if (!page) return state;

    const nodesToDelete = getPageNodeIds(state.nodes, page);

    const newNodes = removeNodesByIds(state.nodes, nodesToDelete);

    let newPages = removePageById(state.pages, pageId);

    if (Object.keys(newPages).length === 0) {
        const defaultPage = createDefaultPage();
        newPages = { ...newPages, [defaultPage.id]: defaultPage };
    }

    const newActivePageId = resolveNextPageIdAfterRemoval(
        newPages,
        pageId,
        state.activePageId,
    );

    const newVarIndex = rebuildVarIndexFromNodes(newNodes);

    return {
        pages: newPages,
        nodes: newNodes,
        selectedIds: [],
        activePageId: newActivePageId,
        varIndex: newVarIndex,
    };
}
