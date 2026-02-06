import { nanoid } from "nanoid";
import {
    createGroupNode,
    makeChildrenLocal,
    replaceRootsWithGroup,
} from "../utils/groups";
import { addNodeToIndex } from "../utils/bindings";

export function groupNodesService(state, ids, bbox) {
    const pageId = state.activePageId;
    const page = state.pages[pageId];
    if (!page) return state;

    const groupId = nanoid(12);

    const groupNode = createGroupNode(groupId, bbox, ids);

    let newNodes = makeChildrenLocal(state.nodes, ids, groupNode);
    newNodes[groupId] = groupNode;

    const newRootIds = replaceRootsWithGroup(page.rootIds, ids, groupId);

    const newIndex = { ...state.varIndex };
    addNodeToIndex(newIndex, groupNode);

    return {
        pages: {
            ...state.pages,
            [pageId]: {
                ...page,
                rootIds: newRootIds,
            },
        },
        nodes: newNodes,
        selectedIds: [groupId],
        varIndex: newIndex,
    };
}
