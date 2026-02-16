import { SHAPES } from "@/pages/HMIEditor/constants";
import { runCommand } from "../runCommand";
import { promoteChildrenToRoot } from "../../utils/groups";
import { unindexNodesCOW } from "../../utils/bindings";

export const ungroupNodesCommand = (api, ids) => {
    runCommand(api, "cmd/groups/ungroupNodes", (state) => {
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        let newNodes = { ...state.nodes };
        let newRootIds = [...page.rootIds];

        const nextSelection = [];

        for (const id of ids) {
            const node = state.nodes[id];
            if (!node || node.type !== SHAPES.group) continue;

            const result = promoteChildrenToRoot({
                newNodes,
                newRootIds,
                groupNode: node,
            });

            newNodes = result.newNodes;
            newRootIds = result.newRootIds;
            nextSelection.push(...result.promotedIds);
        }

        const { varIndex, nodeIndex } = unindexNodesCOW({
            baseNodeIndex: state.nodeIndex,
            baseVarIndex: state.varIndex,
            varIndex: state.varIndex,
            nodeIndex: state.nodeIndex,
            nodeIds: ids,
        });

        const patch = {
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
        };

        return {
            patch,
            dirty: true,
            selection: "set",
            selectedIds: nextSelection,
        };
    });
};
