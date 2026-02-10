export function getTopLevelSelectedIds(nodes, selectedIds) {
    const selectedSet = new Set(selectedIds);

    return selectedIds.filter((id) => {
        const parentId = nodes[id]?.parentId;
        return !parentId || !selectedSet.has(parentId);
    });
}
