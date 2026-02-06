export function removeBindingFunc(newNodes, id, property) {
    const node = newNodes[id];
    if (!node || !node.bindings) return;

    newNodes[id] = {
        ...node,
        bindings: {
            ...node.bindings,
            items: node.bindings.items.filter((b) => b.property !== property),
        },
    };
}
