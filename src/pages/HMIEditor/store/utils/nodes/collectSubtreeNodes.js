export function collectSubtreeNodes(rootIds, nodes) {
    const result = {};
    const stack = [...rootIds];

    while (stack.length) {
        const id = stack.pop();
        const node = nodes[id];
        if (!node || result[id]) continue;

        result[id] = structuredClone(node);

        if (node.childrenIds?.length) {
            stack.push(...node.childrenIds);
        }
    }

    return result;
}

export function collectSubtreeIds(rootIds, nodes) {
    const result = new Set();
    const stack = [...rootIds];

    while (stack.length) {
        const id = stack.pop();
        if (result.has(id)) continue;

        const node = nodes[id];
        if (!node) continue;

        result.add(id);

        if (node.childrenIds?.length) {
            for (const childId of node.childrenIds) {
                if (!result.has(childId)) {
                    stack.push(childId);
                }
            }
        }
    }

    return Array.from(result);
}
