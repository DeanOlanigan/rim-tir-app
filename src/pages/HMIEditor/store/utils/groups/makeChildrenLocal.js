export function makeChildrenLocal(nodes, childIds, groupNode) {
    const updated = { ...nodes };

    for (const id of childIds) {
        const child = nodes[id];
        if (!child) continue;

        updated[id] = {
            ...child,
            x: (child.x ?? 0) - groupNode.x,
            y: (child.y ?? 0) - groupNode.y,
        };
    }

    return updated;
}
