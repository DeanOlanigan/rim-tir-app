import { getNodeLocalTransformMatrix, mul } from "@/pages/HMIEditor/utils";

/**
 * Мировая матрица узла: root <- ... <- parent <- node
 */
export function getNodeWorldTransformMatrix(nodes, id) {
    const node = nodes[id];
    if (!node) return null;

    let M = getNodeLocalTransformMatrix(node);
    let p = node.parentId ?? null;

    // guard от циклов
    const guard = new Set([id]);

    while (p) {
        if (guard.has(p)) break;
        guard.add(p);

        const parent = nodes[p];
        if (!parent) break;

        const P = getNodeLocalTransformMatrix(parent);
        M = mul(P, M);

        p = parent.parentId ?? null;
    }

    return M;
}
