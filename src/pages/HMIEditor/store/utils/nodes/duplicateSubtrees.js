import { SHAPES } from "@/pages/HMIEditor/constants";
import { nanoid } from "nanoid";
import { getTopLevelSelectedIds } from "./getTopLevelSelectedIds";

export function duplicateSubtrees(nodes, ids, opts = {}) {
    const { offset = { x: 1, y: 1 }, groupType = SHAPES.group } = opts;

    const newNodes = { ...nodes };
    const newRootIds = [];
    const newSelectedIds = [];

    // На всякий случай, если в ids будут id, которые уже есть в выбранной группе
    const topLevelIds = getTopLevelSelectedIds(nodes, ids);

    function cloneSubTree(oldId, applyOffset) {
        const oldNode = nodes[oldId];
        if (!oldNode) return;

        const newId = nanoid(12);

        const baseClone = { ...oldNode, id: newId };

        if (applyOffset) {
            if (typeof baseClone.x === "number") baseClone.x += offset.x;
            if (typeof baseClone.y === "number") baseClone.y += offset.y;
        }

        if (oldNode.type === groupType) {
            const oldChildren = Array.isArray(oldNode.childrenIds)
                ? oldNode.childrenIds
                : [];
            baseClone.childrenIds = [];

            newNodes[newId] = baseClone;

            for (const childOldId of oldChildren) {
                const childNewId = cloneSubTree(childOldId, false);
                if (childNewId) baseClone.childrenIds.push(childNewId);
            }
        } else {
            newNodes[newId] = baseClone;
        }

        return newId;
    }

    for (const id of topLevelIds) {
        const newId = cloneSubTree(id, true);
        if (newId) {
            newRootIds.push(newId);
            newSelectedIds.push(newId);
        }
    }

    return {
        nodes: newNodes,
        rootIds: newRootIds,
        selectedIds: newSelectedIds,
    };
}
