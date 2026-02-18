export function replaceGroupWithChildren(containerIds, targetId, childrenIds) {
    const idx = containerIds.indexOf(targetId);
    if (idx === -1) return null;

    const next = containerIds.slice();
    next.splice(idx, 1, ...(childrenIds ?? []));

    return { nextContainerIds: next, insertIndex: idx };
}
