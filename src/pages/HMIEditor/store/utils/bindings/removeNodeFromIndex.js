export function removeNodeFromIndex(index, nodeId) {
    for (const varId in index) {
        index[varId] = index[varId].filter((b) => b.nodeId !== nodeId);
        if (index[varId].length === 0) delete index[varId];
    }
}
