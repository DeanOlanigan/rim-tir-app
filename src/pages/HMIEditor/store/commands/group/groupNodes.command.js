import { nanoid } from "nanoid";
import { runCommand } from "../runCommand";
import { createGroupNode } from "../../utils/groups";
import { buildParentOf } from "../../utils/nodes/buildParentOf";
import { pruneNestedSelection } from "../../utils/groups/pruneNestedSelection";
import { replaceChildrenWithGroup } from "../../utils/groups/replaceChildrenWithGroup";
import { getNodeLocalTransformMatrix, inv } from "@/pages/HMIEditor/utils";
import { calcChildTransform } from "../../utils/geometry";

export const groupNodesCommand = (api, ids, bbox) => {
    runCommand(api, "cmd/groups/groupNodes", (state) => {
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        const parentMap = buildParentOf(state.nodes, page.rootIds);
        const flat = pruneNestedSelection(ids, parentMap);
        if (flat.length < 2) return null;

        const parentId = parentMap[flat[0]] ?? null;
        for (const id of flat) {
            if ((parentMap[id] ?? null) !== parentId) return null;
        }

        let newNodes = { ...state.nodes };

        const container = parentId
            ? {
                  kind: "group",
                  parentId,
                  ids: state.nodes[parentId]?.childrenIds ?? [],
              }
            : { kind: "root", ids: page.rootIds ?? [] };

        const groupId = nanoid(12);

        const replaced = replaceChildrenWithGroup(
            container.ids,
            flat,
            groupId,
            "max",
        );
        if (!replaced) return null;

        const { nextContainerIds, orderedChildIds } = replaced;

        const groupNode = createGroupNode(groupId, bbox, orderedChildIds);

        const G = getNodeLocalTransformMatrix(groupNode);
        const invG = inv(G);
        if (!invG) return null;

        for (const childId of orderedChildIds) {
            const child = newNodes[childId];
            if (!child) continue;
            const { x, y, rotation } = calcChildTransform(invG, child);
            newNodes[childId] = { ...child, x, y, rotation };
        }

        newNodes[groupId] = groupNode;

        if (!parentId) {
            const patch = {
                pages: {
                    ...state.pages,
                    [pageId]: {
                        ...page,
                        rootIds: nextContainerIds,
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
        } else {
            const parent = newNodes[parentId];
            newNodes[parentId] = {
                ...parent,
                childrenIds: nextContainerIds,
            };
            const patch = {
                nodes: newNodes,
            };
            return {
                patch,
                dirty: true,
                selection: "set",
                selectedIds: [groupId],
            };
        }
    });
};
