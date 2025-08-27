export function addNodeUtil(nodes, parentId, newNode, insertIndex = 0) {
    return nodes.map((node) => {
        if (node.id === parentId) {
            const updatedChildren = [...node.children];
            updatedChildren.splice(insertIndex, 0, ...newNode);
            return { ...node, children: updatedChildren };
        }
        if (node.children?.length > 0) {
            return {
                ...node,
                children: addNodeUtil(
                    node.children,
                    parentId,
                    newNode,
                    insertIndex
                ),
            };
        }
        return node;
    });
}

export function createSettingUtil(settings, addSettings) {
    let result = { ...settings };
    for (const setting of addSettings) {
        const nodeId = setting.id;

        if (setting.parentId !== null && result[setting.parentId]) {
            result = {
                ...result,
                [setting.parentId]: {
                    ...result[setting.parentId],
                    children: [...result[setting.parentId].children, nodeId],
                },
            };
        }

        result = {
            ...result,
            [nodeId]: {
                id: nodeId,
                ...setting,
            },
        };
    }
    return result;
}
