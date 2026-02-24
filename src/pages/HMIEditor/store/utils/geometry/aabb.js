import { getNodeLocalTransformMatrix } from "@/pages/HMIEditor/utils";
import { getNodeLocalBounds } from "./getNodeLocalBounds";
import { aabbOfTransformedBounds } from "./aabbOfTransformedBounds";
import { getNodeWorldTransformMatrix } from "./getNodeWorldTransformMatrix";

/**
 * AABB узла в ЛОКАЛЬНЫХ координатах его родителя.
 */
export function getNodeParentLocalAABB(node) {
    const C = getNodeLocalTransformMatrix(node); // child local -> parent local
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
