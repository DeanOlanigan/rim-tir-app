import { unindexNodesCOW } from "../../utils/bindings";
import { collectSubtreeIds } from "../../utils/nodes";
import { runCommand } from "../runCommand";

// TODO: добавить обработку случая удаления последнего элемента в группе
export const removeNodesCommand = (api, ids) => {
    runCommand(api, "cmd/nodes/removeNodes", (state) => {
        // page guard
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        // get node ids to delete set
        const deleteSet = collectSubtreeIds(ids, state.nodes);

        // delete nodes
        const newNodes = { ...state.nodes };
        for (const id in state.nodes) {
            if (deleteSet.has(id)) {
                delete newNodes[id];
                continue;
            }

            const node = state.nodes[id];

            if (node.childrenIds && node.childrenIds.length > 0) {
                const hasDeadChild = node.childrenIds.some((childId) =>
                    deleteSet.has(childId),
                );

                if (hasDeadChild) {
                    newNodes[id] = {
                        ...node,
                        childrenIds: node.childrenIds.filter(
                            (childId) => !deleteSet.has(childId),
                        ),
                    };
                }
            }
        }

        // update page rootIds
        const newRootIds = page.rootIds.filter((nid) => !deleteSet.has(nid));
        const newPage = {
            ...page,
            rootIds: newRootIds,
        };

        const { varIndex, nodeIndex } = unindexNodesCOW({
            baseNodeIndex: state.nodeIndex,
            baseVarIndex: state.varIndex,
            varIndex: state.varIndex,
            nodeIndex: state.nodeIndex,
            nodeIds: deleteSet,
        });

        // create command patch
        const patch = {
            nodes: newNodes,
            pages: { ...state.pages, [pageId]: newPage },
            varIndex,
            nodeIndex,
        };

        return {
            patch,
            dirty: true,
            selection: "clear",
        };
    });
};
