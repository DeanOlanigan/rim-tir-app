import { getNodeWorldTransformMatrix } from "./getNodeWorldTransformMatrix";

/**
 * Мировая матрица родителя узла.
 * Если родителя нет — null (тождественная).
 */
export function getParentWorldTransformMatrix(nodes, id) {
    const parentId = nodes[id]?.parentId ?? null;
    if (!parentId) return null;
    return getNodeWorldTransformMatrix(nodes, parentId);
}
