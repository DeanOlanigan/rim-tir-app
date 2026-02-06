export function removeNodesByIds(nodes, ids) {
    const newNodes = { ...nodes };
    ids.forEach((id) => delete newNodes[id]);
    return newNodes;
}
