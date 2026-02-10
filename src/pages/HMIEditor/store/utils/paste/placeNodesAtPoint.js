import { calcGroupAABBCenter } from "@/pages/HMIEditor/utils";

export function placeNodesAtPoint({ nodes, rootIds, x, y, gridSize }) {
    const nodesList = Object.values(nodes);
    if (!nodesList.length) return;

    const pivot = calcGroupAABBCenter(nodesList);

    let targetX = x;
    let targetY = y;

    if (gridSize > 1) {
        targetX = Math.round(x / gridSize) * gridSize;
        targetY = Math.round(y / gridSize) * gridSize;
    }

    const dx = targetX - pivot.x;
    const dy = targetY - pivot.y;

    rootIds.forEach((id) => {
        const node = nodes[id];
        if (node) {
            node.x += dx;
            node.y += dy;
        }
    });
}
