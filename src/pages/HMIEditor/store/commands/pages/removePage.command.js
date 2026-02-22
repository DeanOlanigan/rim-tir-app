import { createDefaultPages } from "../../fabrics";
import { unindexNodesCOW } from "../../utils/bindings";
import { removeNodesByIds } from "../../utils/nodes";
import {
    getPageNodeIds,
    removePageById,
    resolveNextPageIdAfterRemoval,
    resolveNextThumbPageId,
} from "../../utils/pages";
import { runCommand } from "../runCommand";

export const removePageCommand = (api, id) => {
    return runCommand(api, "cmd/pages/removePage", (state) => {
        const page = state.pages[id];
        if (!page) return null;

        const nodesToDelete = getPageNodeIds(state.nodes, page);

        const newNodes = removeNodesByIds(state.nodes, nodesToDelete);

        let newPages = removePageById(state.pages, id);

        if (Object.keys(newPages).length === 0) {
            newPages = createDefaultPages();
        }

        const newActivePageId = resolveNextPageIdAfterRemoval(
            newPages,
            id,
            state.activePageId,
        );

        const newPageIdWithThumb = resolveNextThumbPageId(
            newPages,
            id,
            state.pageIdWithThumb,
            newActivePageId,
        );

        const { varIndex, nodeIndex } = unindexNodesCOW({
            baseNodeIndex: state.nodeIndex,
            baseVarIndex: state.varIndex,
            varIndex: state.varIndex,
            nodeIndex: state.nodeIndex,
            nodeIds: nodesToDelete,
        });

        const patch = {
            pages: newPages,
            nodes: newNodes,
            activePageId: newActivePageId,
            pageIdWithThumb: newPageIdWithThumb,
            varIndex,
            nodeIndex,
        };

        return {
            patch,
            dirty: true,
        };
    });
};
