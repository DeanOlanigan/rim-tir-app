import { getNodeLocalTransformMatrix } from "@/pages/HMIEditor/utils";
import { calcChildTransform } from "../geometry";

/**
 * Математика: пересчет координат детей группы при переносе к новому родителю
 */
export function reparentChildrenToNewParent(nodes, groupNode, newParentId) {
    const childrenIds = groupNode.childrenIds ?? [];
    const G = getNodeLocalTransformMatrix(groupNode);

    for (const childId of childrenIds) {
        const child = nodes[childId];
        if (!child) continue;

        const { x, y, rotation } = calcChildTransform(G, child);

        nodes[childId] = {
            ...child,
            parentId: newParentId,
            x,
            y,
            rotation,
        };
    }
}
