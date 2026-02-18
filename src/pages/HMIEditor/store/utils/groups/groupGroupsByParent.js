/**
 * Группирует ID групп по их parentId.
 * @returns Map<string | null, string[]>
 */
export function groupGroupsByParent(groupIds, nodes) {
    const byParent = new Map();
    for (const gid of groupIds) {
        const g = nodes[gid];
        if (!g) continue;
        const pid = g.parentId ?? null;
        const arr = byParent.get(pid) ?? [];
        arr.push(gid);
        byParent.set(pid, arr);
    }
    return byParent;
}
