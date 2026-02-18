/**
 * Обновление childrenIds у родительской ноды
 */
export function updateParentNode(nodes, parentId, nextChildrenIds) {
    const parent = nodes[parentId];
    if (parent) {
        nodes[parentId] = {
            ...parent,
            childrenIds: nextChildrenIds,
        };
    }
}
