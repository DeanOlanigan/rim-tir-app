/**
 * Хелпер для группировки ID по parentId.
 * Возвращает Map<string | null, string[]>
 */
export function groupNodesByParent(ids, nodes) {
    const byParent = new Map();
    for (const id of ids) {
        const n = nodes[id];
        if (!n) continue;

        const pid = n.parentId ?? null;
        const arr = byParent.get(pid) ?? [];
        arr.push(id);
        byParent.set(pid, arr);
    }
    return byParent;
}
