import { ensureCOW, removeNodeDeps } from "./helpers";

export function unindexNodesCOW({
    baseVarIndex,
    baseNodeIndex,
    varIndex,
    nodeIndex,
    nodeIds,
}) {
    // 1. Инициализация COW
    const nextVarIndex = ensureCOW(varIndex, baseVarIndex);
    const nextNodeIndex = ensureCOW(nodeIndex, baseNodeIndex);

    for (const nodeId of nodeIds) {
        removeNodeDeps(nodeId, nextNodeIndex, nextVarIndex, baseVarIndex);
    }

    return { varIndex: nextVarIndex, nodeIndex: nextNodeIndex };
}
