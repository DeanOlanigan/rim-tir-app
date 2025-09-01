export function getIdsSetNormalizedContext(context, ids) {
    const set = new Set();
    const stack = [...ids];

    while (stack.length) {
        const id = stack.pop();
        if (set.has(id)) continue;
        set.add(id);
        const node = context[id];
        if (node?.children?.length) {
            for (const childId of node.children) stack.push(childId);
        }
    }

    return set;
}

export function getIdsSetNormalized(treeApi, ids) {
    const set = new Set();
    function recursive(id) {
        set.add(id);
        const node = treeApi.get(id);
        if (!node?.children?.length) return;
        for (const child of treeApi.get(id).children) {
            recursive(child.id);
        }
    }
    for (const id of ids) {
        recursive(id);
    }
    return set;
}

// TODO Подумать над надобностью
export function getIdsSetWithoutNested(treeApi, ids) {
    const idSet = new Set(ids);
    function removeDescendants(id) {
        const node = treeApi.get(id);
        if (!node?.children?.length) return;
        for (const child of treeApi.get(id).children) {
            idSet.delete(child.id);
            removeDescendants(child.id);
        }
    }
    for (const id of ids) {
        removeDescendants(id);
    }
    return idSet;
}
