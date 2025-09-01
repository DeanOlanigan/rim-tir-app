import { removeChildFromParent } from "../core/parentOps";

/**
 * Removes settings from a settings object, given a set of node ids to remove.
 *
 * @param {Object} settings Settings object to remove settings from.
 * @param {Set<string>} idsToRemove Array of node ids to remove settings for.
 * @returns {Object} The input settings object with settings removed, if any.
 */
export function removeSettingUtil(settings, idsToRemove) {
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

        const pid = node.parentId;
        if (pid != null && !idsToRemove.has(pid))
            removeChildFromParent(next, parentCopies, pid, id);
        delete next[id];
    }

    return next;
}
