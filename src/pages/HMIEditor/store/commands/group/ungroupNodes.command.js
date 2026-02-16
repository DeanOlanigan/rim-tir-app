import { SHAPES } from "@/pages/HMIEditor/constants";
import { runCommand } from "../runCommand";
import { unindexNodesCOW } from "../../utils/bindings";
import { buildParentOf } from "../../utils/nodes/buildParentOf";
import { pruneNestedSelection } from "../../utils/groups/pruneNestedSelection";
import { getNodeLocalTransformMatrix } from "@/pages/HMIEditor/utils";
import { calcChildTransform } from "../../utils/geometry";
import { replaceChildrenWithGroup } from "../../utils/groups/replaceChildrenWithGroup";

// TODO Доделать это
export const ungroupNodesCommand = (api, ids) => {
    // eslint-disable-next-line
    runCommand(api, "cmd/groups/ungroupNodes", (state) => {
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        const parentMap = buildParentOf(state.nodes, page.rootIds);
        const pruned = pruneNestedSelection(ids, parentMap);

        const groupIds = pruned.filter(
            (id) => state.nodes[id]?.type === SHAPES.group,
        );
        if (!groupIds.length) return null;

        let newNodes = { ...state.nodes };

        const byParent = new Map();
        for (const gid of groupIds) {
            const pid = parentMap[gid] ?? null;
            const arr = byParent.get(pid) ?? [];
            arr.push(gid);
            byParent.set(pid, arr);
        }

        let newRootIds = [...(page.rootIds ?? [])];
        const nextSelection = [];

        for (const [parentId, gids] of byParent.entries()) {
            let containerIds;
            if (!parentId) {
                containerIds = newRootIds;
            } else {
                containerIds = [...(newNodes[parentId]?.childrenIds ?? [])];
            }

            const orderedGroups = gids
                .map((gid) => ({ gid, idx: containerIds.indexOf(gid) }))
                .filter((x) => x.idx !== -1)
                .sort((a, b) => b.idx - a.idx);

            for (const { gid } of orderedGroups) {
                const groupNode = newNodes[gid];
                if (!groupNode || groupNode.type !== SHAPES.group) continue;

                const children = groupNode.childrenIds ?? [];
                const G = getNodeLocalTransformMatrix(groupNode);

                for (const childId of children) {
                    const child = newNodes[childId];
                    if (!child) continue;
                    const { x, y, rotation } = calcChildTransform(G, child);
                    newNodes[childId] = { ...child, x, y, rotation };
                }

                const rep = replaceChildrenWithGroup(
                    containerIds,
                    gid,
                    children,
                );
                if (!rep) containerIds = rep.nextContainerIds;

                delete newNodes[gid];

                nextSelection.push(...children);
            }

            if (!parentId) {
                newRootIds = containerIds;
            } else {
                const parent = newNodes[parentId];
                newNodes[parentId] = {
                    ...parent,
                    childrenIds: containerIds,
                };
            }
        }

        const { varIndex, nodeIndex } = unindexNodesCOW({
            baseNodeIndex: state.nodeIndex,
            baseVarIndex: state.varIndex,
            varIndex: state.varIndex,
            nodeIndex: state.nodeIndex,
            nodeIds: groupIds,
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
