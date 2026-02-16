export function replaceGroupWithChildren(containerIds, groupId, childrenIds) {
    const idx = containerIds.indexOf(groupId);
    if (idx === -1) return null;

    const next = containerIds.slice();
    next.splice(idx, 1, ...(childrenIds ?? []));
    return { nextContainerIds: next, insertIndex: idx };
}
