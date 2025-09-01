export function removeChildFromParent(next, parentCopies, parentId, childId) {
    const parent = ensureParentCopy(next, parentCopies, parentId);
    if (!parent || !parent.children?.length) return;
    const before = parent.children;
    if (!before.includes(childId)) return;
    const after = before.filter((cid) => cid !== childId);
    parent.children = after;
}

function ensureParentCopy(map, parentCopies, parentId) {
    if (parentId === null || !map[parentId]) return null;
    if (parentCopies.has(parentId)) return parentCopies.get(parentId);

    const src = map[parentId];
    const copy = {
        ...src,
        children: Array.isArray(src.children) ? [...src.children] : [],
    };
    map[parentId] = copy;
    parentCopies.set(parentId, copy);
    return copy;
}

export function getParentId(treeApi) {
    const { focusedNode, props } = treeApi;
    if (!focusedNode) return props.treeType;
    if (focusedNode.children) return focusedNode.id;
    if (focusedNode.parent.id === props.treeType) return props.treeType;
    return focusedNode.parent.id;
}
