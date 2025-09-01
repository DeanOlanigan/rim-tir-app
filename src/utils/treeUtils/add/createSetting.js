export function createSettingUtil(settings, addSettings) {
    if (!addSettings || addSettings.length === 0) return settings;

    let result = { ...settings };

    for (const node of addSettings) {
        const nodeId = node.id;
        if (!nodeId) continue;

        if (node.parentId !== null && result[node.parentId]) {
            result = {
                ...result,
                [node.parentId]: {
                    ...result[node.parentId],
                    children: [...result[node.parentId].children, nodeId],
                },
            };
        }

        result = {
            ...result,
            [nodeId]: {
                id: nodeId,
                ...node,
            },
        };
    }
    return result;
}
