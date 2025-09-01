export function addNodeUtil(nodes, parentId, newNodes, insertIndex = 0) {
    return nodes.map((node) => {
        if (node.id === parentId) {
            const updatedChildren = [...node.children];
            updatedChildren.splice(insertIndex, 0, ...newNodes);
            return { ...node, children: updatedChildren };
        }
        if (node.children?.length > 0) {
            const updated = addNodeUtil(
                node.children,
                parentId,
                newNodes,
                insertIndex
            );
            return updated !== node.children
                ? { ...node, children: updated }
                : node;
        }
        return node;
    });
}
