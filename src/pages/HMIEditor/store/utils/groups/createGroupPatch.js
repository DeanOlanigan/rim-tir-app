/**
 * Собирает ответ для runCommand.
 * Разделяет логику обновления Root и обычного Parent.
 */
export function createGroupPatch({
    state,
    pageId,
    page,
    parentId,
    nextContainerIds,
    newNodes,
    groupId,
}) {
    const patch = {};

    // Если родитель - корень, обновляем страницу
    if (parentId === null) {
        patch.pages = {
            ...state.pages,
            [pageId]: {
                ...page,
                rootIds: nextContainerIds,
            },
        };
        patch.nodes = newNodes;
    }
    // Иначе обновляем родительскую ноду
    else {
        const parent = newNodes[parentId];
        if (parent) {
            newNodes[parentId] = {
                ...parent,
                childrenIds: nextContainerIds,
            };
        }
        patch.nodes = newNodes;
    }

    return {
        patch,
        dirty: true,
        tree: true,
        selection: "set",
        selectedIds: [groupId],
    };
}
