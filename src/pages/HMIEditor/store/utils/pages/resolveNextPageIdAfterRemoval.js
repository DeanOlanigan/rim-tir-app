export function resolveNextPageIdAfterRemoval(
    pages,
    removedPageId,
    currentActiveId,
) {
    let newActiveId = currentActiveId;
    if (currentActiveId === removedPageId) {
        const remainingIds = Object.keys(pages);
        newActiveId = remainingIds.length > 0 ? remainingIds[0].id : null;
    }
    return newActiveId;
}
