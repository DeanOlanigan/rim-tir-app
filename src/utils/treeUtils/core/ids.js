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
