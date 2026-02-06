import { createDefaultPage } from "./createDefaultPage";

export function resolveNextPageIdAfterRemoval(
    pages,
    removedPageId,
    currentActiveId,
) {
    let newActiveId = currentActiveId;
    if (currentActiveId === removedPageId) {
        const remainingIds = Object.keys(pages);
        newActiveId = remainingIds.length > 0 ? remainingIds[0] : null;
    }
    if (!newActiveId) {
        newActiveId = createDefaultPage();
    }
    return newActiveId;
}
