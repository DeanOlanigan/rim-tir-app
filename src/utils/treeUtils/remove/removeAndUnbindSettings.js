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

        clearVariableId(setting, idsToRemove, next, node.rootId);
        clearUsedIn(setting, idsToRemove, next);

        delete next[id];
    }
    return next;
}

function clearVariableId(setting, idsSet, next, root) {
    if (setting.variableId != null) {
        const varId = setting.variableId;
        if (!idsSet.has(varId) && next[varId]) {
            const varNode = ensureNodeSettingCopy(next, varId);
            if (root === "receive" || root === "send") {
                const map = { ...(varNode.setting.usedIn ?? {}) };
                map[root] = null;
                varNode.setting.usedIn = map;
            }
        }
    }
}

function clearUsedIn(setting, idsSet, next) {
    const used = setting.usedIn;
    if (!used) return;

    const recvOwner = used.receive;
    if (recvOwner && !idsSet.has(recvOwner) && next[recvOwner]) {
        const ownerNode = ensureNodeSettingCopy(next, recvOwner);
        if (ownerNode) ownerNode.setting.variableId = null;
    }

    const sendOwner = used.send;
    if (sendOwner && !idsSet.has(sendOwner) && next[sendOwner]) {
        const ownerNode = ensureNodeSettingCopy(next, sendOwner);
        if (ownerNode) ownerNode.setting.variableId = null;
    }
}
