export function unbindVariableUtil(settings, nodeId) {
    let result = { ...settings };

    const recursive = (nodeId) => {
        const node = result[nodeId];

        if (Array.isArray(node.children) && node.children?.length > 0) {
            for (const childId of node.children) {
                recursive(childId);
            }
        }

        if (node.setting.variableId) {
            const varId = node.setting.variableId;
            result = {
                ...result,
                [nodeId]: {
                    ...result[nodeId],
                    setting: {
                        ...result[nodeId].setting,
                        variableId: null,
                    },
                },
                [varId]: {
                    ...result[varId],
                    setting: {
                        ...result[varId].setting,
                        usedIn: null,
                    },
                },
            };
        }

        if (node.setting.usedIn) {
            const objId = node.setting.usedIn;
            result = {
                ...result,
                [nodeId]: {
                    ...result[nodeId],
                    setting: {
                        ...result[nodeId].setting,
                        usedIn: null,
                    },
                },
                [objId]: {
                    ...result[objId],
                    setting: {
                        ...result[objId].setting,
                        variableId: null,
                    },
                },
            };
        }
    };

    recursive(nodeId);
    return result;
}

export function bindVariableUtil(settings, nodeId, variableId) {
    return {
        ...settings,
        [nodeId]: {
            ...settings[nodeId],
            setting: {
                ...settings[nodeId].setting,
                variableId: variableId,
            },
        },
        [variableId]: {
            ...settings[variableId],
            setting: {
                ...settings[variableId].setting,
                usedIn: nodeId,
            },
        },
    };
}

export function unbindVariableUtil2(settings, ids) {
    let next = settings;
    let mutated = false;

    for (const id of ids) {
        const node = settings[id];
        if (!node || node.variableId === null) continue;

        const varId = node.variableId;
        if (!mutated) {
            next = { ...settings };
            mutated = true;
        }
        next[id] = { ...node, variableId: null };

        const v = settings[varId];
        if (!v) continue;

        if (v.usedIn != null) {
            next[varId] = { ...v, usedIn: null };
        }
    }

    return mutated ? next : settings;
}
