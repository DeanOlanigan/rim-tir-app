import { ensureNodeSettingCopy } from "../core/ensureNodeSettingCopy";

/**
 * Bind variable to a node in the settings tree.
 * If the variable is already used by another node, unbind it from that node.
 * If the node is already bound to another variable, unbind it from that variable.
 *
 * @param {Object} settings - The settings flat tree.
 * @param {string} nodeId - The id of the node to which the variable should be bound.
 * @param {string} variableId - The id of the variable to bind.
 */
export function bindVariableUtil(settings, nodeId, variableId) {
    const owner = settings[nodeId];
    const variable = settings[variableId];

    if (!owner || !variable) return settings;
    if (nodeId === variableId) return settings;

    const ownerSetting = owner.setting ?? {};
    const variableSetting = variable.setting ?? {};
    const already =
        ownerSetting.variableId === variableId &&
        variableSetting.usedIn === nodeId;
    if (already) return settings;

    let next = { ...settings };

    if (
        ownerSetting.variableId != null &&
        ownerSetting.variableId !== variableId
    ) {
        const oldVarId = ownerSetting.variableId;
        const oldVar = settings[oldVarId];
        if (oldVar) {
            const node = ensureNodeSettingCopy(next, oldVarId);
            node.setting.usedIn = null;
        }
    }

    if (variableSetting.usedIn != null && variableSetting.usedIn !== nodeId) {
        const oldOwnerId = variableSetting.usedIn;
        const oldOwner = settings[oldOwnerId];
        if (oldOwner) {
            const node = ensureNodeSettingCopy(next, oldOwnerId);
            node.setting.variableId = null;
        }
    }

    const ownerNode = ensureNodeSettingCopy(next, nodeId);
    ownerNode.setting.variableId = variableId;

    const variableNode = ensureNodeSettingCopy(next, variableId);
    variableNode.setting.usedIn = nodeId;

    return next;

    /* return {
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
    }; */
}
