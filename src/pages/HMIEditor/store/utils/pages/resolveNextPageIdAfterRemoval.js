export function resolveNextPageIdAfterRemoval(
    pages,
    removedPageId,
    currentActiveId,
) {
    if (currentActiveId !== removedPageId) return currentActiveId;
    const remainingIds = Object.keys(pages);
    return remainingIds.length > 0 ? remainingIds[0] : null;
}
