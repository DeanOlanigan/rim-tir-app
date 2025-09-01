export function editSettingUtil(settings, nodeId, setting) {
    return {
        ...settings,
        [nodeId]: {
            ...settings[nodeId],
            setting: {
                ...settings[nodeId].setting,
                ...setting,
            },
        },
    };
}
