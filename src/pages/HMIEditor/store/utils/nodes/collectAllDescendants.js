export const collectAllDescendants = (nodeId, nodes, acc = []) => {
    acc.push(nodeId);
    const node = nodes[nodeId];
    if (node && node.type === "Group" && node.childrenIds) {
        // Пример для группы
        node.childrenIds.forEach((childId) =>
            collectAllDescendants(childId, nodes, acc),
        );
    }
    // Если у тебя другая структура вложенности, адаптируй этот обход
    return acc;
};
