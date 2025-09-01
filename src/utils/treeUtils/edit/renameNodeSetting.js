export function renameNodeSettingUtil(setting, nodeId, name) {
    return {
        ...setting,
        [nodeId]: {
            ...setting[nodeId],
            name,
        },
    };
}
