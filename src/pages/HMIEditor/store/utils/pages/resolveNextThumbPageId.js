function firstPageId(pages) {
    const ids = Object.keys(pages);
    return ids.length > 0 ? ids[0] : null;
}

export function resolveNextThumbPageId(
    pages,
    removedPageId,
    prevThumbId,
    nextActiveId,
) {
    // если превью-страница не удалялась — оставляем (но проверим что она существует)
    if (prevThumbId && prevThumbId !== removedPageId) {
        return pages[prevThumbId]
            ? prevThumbId
            : (nextActiveId ?? firstPageId(pages));
    }

    // если превью не было задано или оно удалилось — ставим активную (или первую)
    return nextActiveId ?? firstPageId(pages);
}
