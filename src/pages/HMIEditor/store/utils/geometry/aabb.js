import {
    applyToPoint,
    getNodeLocalTransformMatrix,
    isLineLikeType,
} from "@/pages/HMIEditor/utils";
import { getNodeLocalBounds } from "./getNodeLocalBounds";
import { aabbOfTransformedBounds } from "./aabbOfTransformedBounds";
import { getNodeWorldTransformMatrix } from "./getNodeWorldTransformMatrix";

/**
 * AABB узла в ЛОКАЛЬНЫХ координатах его родителя.
 */
export function getNodeParentLocalAABB(node) {
    const C = getNodeLocalTransformMatrix(node); // child local -> parent local

    if (isLineLikeType(node.type)) {
        return getLineLikeParentLocalAABB(node, C);
    }

    const b = getNodeLocalBounds(node);
    return aabbOfTransformedBounds(b, C);
}

/**
 * AABB узла в МИРОВЫХ координатах.
 */
export function getNodeWorldAABB(nodes, id, node) {
    const M = getNodeWorldTransformMatrix(nodes, id);
    if (!M) return null;
    const b = getNodeLocalBounds(node);
    return aabbOfTransformedBounds(b, M);
}

function getLineLikeParentLocalAABB(node, M) {
    const pts = node.points ?? [0, 0];
    if (pts.length < 2) {
        const p = applyToPoint(M, 0, 0);
        return { x: p.x, y: p.y, width: 0, height: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < pts.length; i += 2) {
        const x = pts[i];
        const y = pts[i + 1];
        const p = applyToPoint(M, x, y);

        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
    }

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}
