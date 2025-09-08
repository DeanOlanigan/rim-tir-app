export function createSettingUtil(settings, addSettings) {
    if (!addSettings || addSettings.length === 0) return settings;

    let result = { ...settings };

    for (const node of addSettings) {
        if (!node.id) continue;

        if (node.parentId !== null && result[node.parentId]) {
            result = {
                ...result,
                [node.parentId]: {
                    ...result[node.parentId],
                    children: [...result[node.parentId].children, node.id],
                },
            };
        }

        result = {
            ...result,
            [node.id]: {
                ...node,
            },
        };
    }
    return result;
}
