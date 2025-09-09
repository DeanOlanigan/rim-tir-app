import { ensureNodeSettingCopy } from "../core/ensureNodeSettingCopy";

/**
 * Универсальная отвязка.
 * Если id — это DO (rootId = receive|send):
 *   - обнуляем у DO: variableId
 *   - на переменной чистим usedIn[DO.rootId], если указывает на этот DO
 *
 * Если id — это Variable (rootId = variables):
 *   - для всех корней (receive, send) находим связанные DO и обнуляем у них variableId
 *   - у самой переменной чистим usedIn по всем корням
 *
 * @param {Object} settings
 * @param {string} id - id dataObject ИЛИ id переменной
 * @returns {Object}
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

    if (node.rootId === "receive" || node.rootId === "send") {
        const doSetting = node.setting ?? {};
        const varId = doSetting.variableId;
        if (!varId) return settings;

        ensureMapCopy();

        const doCopy = ensureNodeSettingCopy(next, id);
        doCopy.setting.variableId = null;

        const varNode = settings[varId] && ensureNodeSettingCopy(next, varId);
        if (varNode) {
            const map = { ...(varNode.setting.usedIn ?? {}) };
            if (map[node.rootId] === id) map[node.rootId] = null;
            varNode.setting.usedIn = map;
        }

        return mutated ? next : settings;
    }

    if (node.rootId === "variables") {
        const varSetting = node.setting ?? {};
        const map = varSetting.usedIn ?? {};
        const roots = ["receive", "send"];

        let touched = false;
        for (const root of roots) {
            const ownerId = map[root];
            if (!ownerId) continue;

            ensureMapCopy();
            touched = true;

            const owner =
                settings[ownerId] && ensureNodeSettingCopy(next, ownerId);
            if (owner && owner.setting.variableId === id) {
                owner.setting.variableId = null;
            }
        }

        if (touched) {
            const varCopy = ensureNodeSettingCopy(next, id);
            const newMap = { ...(varCopy.setting.usedIn ?? {}) };
            for (const root of roots) {
                newMap[root] = null;
            }
            varCopy.setting.usedIn = newMap;
        }

        return mutated ? next : settings;
    }

    return settings;
}
