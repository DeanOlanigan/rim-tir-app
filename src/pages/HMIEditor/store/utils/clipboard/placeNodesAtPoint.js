import { calcGroupAABBCenter } from "@/pages/HMIEditor/utils";

function calculateSnapDelta({ currentCenter, targetPoint, gridSize }) {
    let targetX = targetPoint.x;
    let targetY = targetPoint.y;

    if (gridSize > 1) {
        targetX = Math.round(targetPoint.x / gridSize) * gridSize;
        targetY = Math.round(targetPoint.y / gridSize) * gridSize;
    }

    return {
        dx: targetX - currentCenter.x,
        dy: targetY - currentCenter.y,
    };
}

function applyPositionDelta(nodesList, dx, dy, snap) {
    for (const node of nodesList) {
        const nx = node.x + dx;
        const ny = node.y + dy;
        node.x = snap ? Math.round(nx) : nx;
        node.y = snap ? Math.round(ny) : ny;
    }
}

// children coords are local
export function placeNodesAtPoint({ nodes, rootIds, x, y, gridSize }) {
    const rootNodes = rootIds.map((id) => nodes[id]).filter(Boolean);
    if (!rootNodes.length) return;

    const pivot = calcGroupAABBCenter(rootNodes);

    const { dx, dy } = calculateSnapDelta({
        currentCenter: pivot,
        targetPoint: { x, y },
        gridSize,
    });

    applyPositionDelta(rootNodes, dx, dy, gridSize > 1);
}
