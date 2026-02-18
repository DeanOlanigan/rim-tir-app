import { getNodeLocalTransformMatrix, inv } from "@/pages/HMIEditor/utils";
import { calcChildTransform } from "../geometry";

/**
 * Вычисляет новые координаты детей относительно группы.
 * Возвращает обновленный объект nodes (копию).
 */
export function reparentChildrenToGroup({ nodes, groupNode, childIds }) {
    const G = getNodeLocalTransformMatrix(groupNode);
    const invG = inv(G);
    if (!invG) return null;

    const newNodes = { ...nodes };
    // Добавляем саму группу
    newNodes[groupNode.id] = groupNode;

    for (const childId of childIds) {
        const child = newNodes[childId];
        if (!child) continue;

        const { x, y, rotation } = calcChildTransform(invG, child);

        newNodes[childId] = {
            ...child,
            parentId: groupNode.id,
            x,
            y,
            rotation,
        };
    }

    return newNodes;
}
