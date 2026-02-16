import { buildIndexesFromNodes } from "../../utils/bindings";
import { prepareInsertFromPayload } from "../../utils/clipboard/prepareInsert";

export function buildInsertPatch(state, payload, placement) {
    const pageId = state.activePageId;
    const page = state.pages[pageId];
    if (!page) return null;

    const prepared = prepareInsertFromPayload(payload, placement);
    if (!prepared) return null;

    const { nodesToInsert, rootIdsToInsert } = prepared;

    const nextNodes = { ...state.nodes, ...nodesToInsert };
    const nextPage = {
        ...page,
        rootIds: [...page.rootIds, ...rootIdsToInsert],
    };

    const patch = {
        nodes: nextNodes,
        pages: { ...state.pages, [pageId]: nextPage },
    };

    if (state.nodeIndex || state.varIndex) {
        const { nodeIndex, varIndex } = buildIndexesFromNodes(nextNodes);
        patch.nodeIndex = nodeIndex;
        patch.varIndex = varIndex;
    }

    return { patch, insertedRootIds: rootIdsToInsert };
}
