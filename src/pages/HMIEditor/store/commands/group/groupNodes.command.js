import { nanoid } from "nanoid";
import { runCommand } from "../runCommand";
import {
    createGroupNode,
    makeChildrenLocal,
    replaceRootsWithGroup,
} from "../../utils/groups";

export const groupNodesCommand = (api, ids, bbox) => {
    runCommand(api, "cmd/groups/groupNodes", (state) => {
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        const groupId = nanoid(12);

        const groupNode = createGroupNode(groupId, bbox, ids);

        let newNodes = makeChildrenLocal(state.nodes, ids, groupNode);
        newNodes[groupId] = groupNode;

        const newRootIds = replaceRootsWithGroup(page.rootIds, ids, groupId);

        const patch = {
            pages: {
                ...state.pages,
                [pageId]: {
                    ...page,
                    rootIds: newRootIds,
                },
            },
            nodes: newNodes,
        };

        return {
            patch,
            dirty: true,
            selection: "set",
            selectedIds: [groupId],
        };
    });
};
