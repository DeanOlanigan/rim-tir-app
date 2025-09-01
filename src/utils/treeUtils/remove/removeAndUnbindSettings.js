import { ensureNodeSettingCopy } from "../core/ensureNodeSettingCopy";
import { removeChildFromParent } from "../core/parentOps";

/**
 * Removes the nodes with the given ids from the settings tree and unbinds
 * any variables that were bound to the removed nodes.
 *
 * @param {Object} settings - The settings flat tree.
 * @param {Set<string>} idsToRemove - The set of ids to remove.
 * @returns {Object} The updated settings tree.
 */
export function removeAndUnbindSettingsUtil(settings, idsToRemove) {
    let next = settings;
    let mutated = false;
    const parentCopies = new Map();

    for (const id of idsToRemove) {
        const node = next[id];
        if (!node) continue;

        if (!mutated) {
            next = { ...settings };
            mutated = true;
        }

        const setting = node.setting ?? {};

        if (node.parentId != null && !idsToRemove.has(node.parentId)) {
            removeChildFromParent(next, parentCopies, node.parentId, id);
        }

        clearVariableId(setting, idsToRemove, next);
        clearUsedIn(setting, idsToRemove, next);

        delete next[id];
    }
    return next;
}

function clearVariableId(setting, idsSet, next) {
    if (setting.variableId != null) {
        const varId = setting.variableId;
        if (!idsSet.has(varId) && next[varId]) {
            const varNode = ensureNodeSettingCopy(next, varId);
            if (varNode) varNode.setting.usedIn = null;
        }
    }
}

function clearUsedIn(setting, idsSet, next) {
    if (setting.usedIn != null) {
        const ownerId = setting.usedIn;
        if (!idsSet.has(ownerId) && next[ownerId]) {
            const ownerNode = ensureNodeSettingCopy(next, ownerId);
            if (ownerNode) ownerNode.setting.variableId = null;
        }
    }
}
