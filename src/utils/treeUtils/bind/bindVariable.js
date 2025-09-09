import { ensureNodeSettingCopy } from "../core/ensureNodeSettingCopy";

/**
 * Привязать variableId к dataObject (nodeId) с учётом корня nodeId (receive|send).
 * Обновляет обе стороны:
 *   - у DO: setting.variableId = variableId
 *   - у Variable: setting.usedIn[rootId] = nodeId
 * Если была предыдущая привязка в этом же root'е — корректно отвязывает её.
 *
 * @param {Object} settings - плоская карта узлов
 * @param {string} nodeId   - id dataObject из receive|send дерева
 * @param {string} variableId - id переменной из variables дерева
 * @returns {Object} обновлённая карта
 */
export function bindVariableUtil(settings, nodeId, variableId) {
    const owner = settings[nodeId];
    const variable = settings[variableId];

    if (!owner || !variable) return settings;
    if (nodeId === variableId) return settings;

    const ownerRoot = owner.rootId;
    if (ownerRoot === "variables") return settings;

    const ownerSetting = owner.setting ?? {};
    const variableSetting = variable.setting ?? {};
    const usedIn = variableSetting.usedIn ?? {};

    const already =
        ownerSetting.variableId === variableId &&
        variableSetting.usedIn === nodeId;
    if (already) return settings;

    let next = { ...settings };

    const prevVarId = ownerSetting.variableId;
    ownerCheck(prevVarId, next, ownerRoot, nodeId, variableId);

    const prevOwnerIdInThisRoot = usedIn[ownerRoot];
    variableCheck(prevOwnerIdInThisRoot, next, nodeId, variableId);

    const ownerNode = ensureNodeSettingCopy(next, nodeId);
    ownerNode.setting.variableId = variableId;

    const variableNode = ensureNodeSettingCopy(next, variableId);
    const newMap = { ...(variableNode.setting.usedIn ?? {}) };
    newMap[ownerRoot] = nodeId;
    variableNode.setting.usedIn = newMap;

    return next;
}

function ownerCheck(prevVarId, next, ownerRoot, nodeId, variableId) {
    if (prevVarId != null && prevVarId !== variableId) {
        const prevVar =
            next[prevVarId] && ensureNodeSettingCopy(next, prevVarId);
        if (prevVar) {
            const map = { ...(prevVar.setting.usedIn ?? {}) };
            if (map[ownerRoot] === nodeId) map[ownerRoot] = null;
            prevVar.setting.usedIn = map;
        }
    }
}

function variableCheck(prevOwnerIdInThisRoot, next, nodeId, variableId) {
    if (prevOwnerIdInThisRoot && prevOwnerIdInThisRoot !== nodeId) {
        const prevOwner =
            next[prevOwnerIdInThisRoot] &&
            ensureNodeSettingCopy(next, prevOwnerIdInThisRoot);
        if (prevOwner) {
            if ((prevOwner.setting ?? {}).variableId === variableId) {
                prevOwner.setting.variableId = null;
            }
        }
    }
}
