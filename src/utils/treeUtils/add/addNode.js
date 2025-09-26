export function addNodeUtil(nodes, parentId, newNodes) {
    if (!parentId) return nodes;
    return nodes.map((node) => {
        if (node.id === parentId) {
            const updatedChildren = [...node.children];
            updatedChildren.splice(node.children.length, 0, ...newNodes);
            return { ...node, children: updatedChildren };
        }
        if (node.children?.length > 0) {
            const updated = addNodeUtil(node.children, parentId, newNodes);
            return updated !== node.children
                ? { ...node, children: updated }
                : node;
        }
        return node;
    });
}
