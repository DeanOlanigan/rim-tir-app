export function getTopLevelSelectedIds(nodes, selectedIds) {
    const selectedSet = new Set(selectedIds);

    return selectedIds.filter((id) => {
        let cur = nodes[id]?.parentId ?? null;
        const guard = new Set();
        while (cur) {
            if (selectedSet.has(cur)) return false;
            if (guard.has(cur)) break;
            guard.add(cur);
            cur = nodes[cur]?.parentId ?? null;
        }
        return true;
    });
}
