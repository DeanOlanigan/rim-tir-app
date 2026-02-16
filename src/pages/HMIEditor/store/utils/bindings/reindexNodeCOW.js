import {
    collectDepsForNode,
    depKeyOf,
    ensureCOW,
    removeNodeDeps,
} from "./helpers";

export function reindexNodeCOW({
    baseVarIndex,
    baseNodeIndex,
    varIndex,
    nodeIndex,
    node,
}) {
    // 1. Инициализация COW для корневых структур
    const nextVarIndex = ensureCOW(varIndex, baseVarIndex);
    const nextNodeIndex = ensureCOW(nodeIndex, baseNodeIndex);
    const nodeId = node.id;

    // 2. Удаление старых зависимостей
    removeNodeDeps(nodeId, nextNodeIndex, nextVarIndex, baseVarIndex);

    // 2) добавить новые зависимости
    const deps = collectDepsForNode(node);
    if (deps.length > 0) {
        // Инициализируем запись для узла, если её нет
        nextNodeIndex[nodeId] ||= {};

        for (const { varId, prop } of deps) {
            const depKey = depKeyOf(nodeId, prop);

            const baseBucket = baseVarIndex[varId];
            const curBucket = nextVarIndex[varId];
            // COW для бакета переменной (создаем новый или копируем существующий)
            if (!curBucket) {
                nextVarIndex[varId] = {};
            } else {
                nextVarIndex[varId] = ensureCOW(curBucket, baseBucket);
            }
            // Записываем зависимость
            nextVarIndex[varId][depKey] = { nodeId, prop };

            // Обновляем маппинг узла
            nextNodeIndex[nodeId][prop] = varId;
        }
    }

    return { varIndex: nextVarIndex, nodeIndex: nextNodeIndex };
}
