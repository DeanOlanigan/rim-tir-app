import { addNodeToIndex } from "./addNodeToindex";

export function rebuildVarIndexFromNodes(nodes) {
    const newVarIndex = {};
    Object.values(nodes).forEach((node) => addNodeToIndex(newVarIndex, node));
    return newVarIndex;
}
