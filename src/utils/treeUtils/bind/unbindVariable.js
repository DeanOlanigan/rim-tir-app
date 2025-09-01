import { ensureNodeSettingCopy } from "../core/ensureNodeSettingCopy";

/**
 * Unbind a variable from a node in the settings tree.
 * If the variable is bound to the node, unbind it.
 * If the node is used by another variable, unbind it from that variable.
 *
 * @param {Object} settings - The settings flat tree.
 * @param {string} id - The id of the node to which the variable should be unbound.
 * @returns {Object} The updated settings tree.
 */
export function unbindVariableUtil(settings, id) {
    let next = settings;
    let mutated = false;

    const ensureMapCopy = () => {
        if (!mutated) {
            next = { ...settings };
            mutated = true;
        }
    };

    const node = settings[id];
    if (!node) return settings;
    const setting = node.setting ?? {};

    if (setting.variableId != null) {
        const varId = setting.variableId;
        ensureMapCopy();
        const owner = ensureNodeSettingCopy(next, id);
        owner.setting.variableId = null;

        const variable = settings[varId];
        if (variable) {
            const node = ensureNodeSettingCopy(next, varId);
            node.setting.usedIn = null;
        }
    }

    if (setting.usedIn != null) {
        const ownerId = setting.usedIn;
        ensureMapCopy();
        const variable = ensureNodeSettingCopy(next, id);
        variable.setting.usedIn = null;

        const owner = settings[ownerId];
        if (owner) {
            const node = ensureNodeSettingCopy(next, ownerId);
            node.setting.variableId = null;
        }
    }

    return mutated ? next : settings;
}
