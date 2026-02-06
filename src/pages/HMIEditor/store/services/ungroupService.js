import { SHAPES } from "@/pages/HMIEditor/constants";
import { removeNodeFromIndex } from "../utils/bindings";
import { promoteChildrenToRoot } from "../utils/groups";

export function ungroupNodesService(state, ids) {
    const pageId = state.activePageId;
    const page = state.pages[pageId];
    if (!page) return state;

    let newNodes = { ...state.nodes };
    let newRootIds = [...page.rootIds];
    let newIndex = { ...state.varIndex };

    const nextSelection = [];

    for (const id of ids) {
        const node = state.nodes[id];
        if (!node || node.type !== SHAPES.group) continue;

        removeNodeFromIndex(newIndex, id);

        const result = promoteChildrenToRoot({
            nodes: newNodes,
            rootIds: newRootIds,
            groupNode: node,
        });

        newNodes = result.newNodes;
        newRootIds = result.newRootIds;
        nextSelection.push(...result.promotedIds);
    }

    return {
        nodes: newNodes,
        varIndex: newIndex,
        selectedIds: nextSelection,
        pages: {
            ...state.pages,
            [pageId]: {
                ...page,
                rootIds: newRootIds,
            },
        },
    };
}
