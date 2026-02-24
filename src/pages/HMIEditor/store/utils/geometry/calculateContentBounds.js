/**
 * Проходит по узлам и считает общий bounding box
 */
export function calculateContentBounds(nodes, ids, getAABBForId, aabbMap) {
    let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

    for (const id of ids) {
        const child = nodes[id];
        if (!child) continue;

        const aabb = getAABBForId(id, child);
        if (!aabb) continue;
        if (aabbMap) aabbMap.set(id, aabb);

        minX = Math.min(minX, aabb.x);
        minY = Math.min(minY, aabb.y);
        maxX = Math.max(maxX, aabb.x + aabb.width);
        maxY = Math.max(maxY, aabb.y + aabb.height);
    }

    if (!isFinite(minX) || !isFinite(minY)) return null;

    return { minX, minY, maxX, maxY };
}
