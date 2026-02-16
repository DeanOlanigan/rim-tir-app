import { collectDepsForNode, depKeyOf } from "./helpers";

export function buildIndexesFromNodes(nodes) {
    const varIndex = {};
    const nodeIndex = {};

    for (const node of Object.values(nodes)) {
        const deps = collectDepsForNode(node);
        // Если зависимостей нет, узел не попадает ни в один из индексов
        if (!deps.length) continue;

        // 1. Подготовка записи в nodeIndex (прямой индекс: Node -> Vars)
        const nodeDepsMap = (nodeIndex[node.id] ||= {});

        for (const { varId, prop } of deps) {
            // Записываем связь "свойство -> переменная"
            nodeDepsMap[prop] = varId;
            // 2. Подготовка записи в varIndex (обратный индекс: Var -> Nodes)
            const varBucket = (varIndex[varId] ||= {});

            const depKey = depKeyOf(node.id, prop);
            varBucket[depKey] = { nodeId: node.id, prop };
        }
    }

    return { varIndex, nodeIndex };
}
