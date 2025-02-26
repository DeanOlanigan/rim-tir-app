export function addNodeUtil(nodes, parentId, newNode, insertIndex = 0) {
    return nodes.map((node) => {
        if (node.id === parentId) {
            const updatedChildren = [...node.children];
            updatedChildren.splice(insertIndex, 0, newNode);
            return { ...node, children: updatedChildren };
        }
        if (node.children?.length > 0) {
            return {
                ...node,
                children: addNodeUtil(
                    node.children,
                    parentId,
                    newNode,
                    insertIndex
                ),
            };
        }
        return node;
    });
}

export function renameNodeUtil(nodes, nodeId, name) {
    return nodes.map((node) => {
        if (node.id === nodeId) {
            const updated = {
                ...node,
                name,
            };
            return updated;
        }
        if (node.children?.length > 0)
            return {
                ...node,
                children: renameNodeUtil(node.children, nodeId, name),
            };
        return node;
    });
}

export function removeNodeUtil(nodes, nodeIds) {
    return nodes
        .filter((node) => !nodeIds.includes(node.id))
        .map((node) => ({
            ...node,
            children: node.children
                ? removeNodeUtil(node.children, nodeIds)
                : undefined,
        }));
}

export function moveNodeUtil(state, dragIds, parentId, index) {
    let updatedNodes = [...state];
    const draggedNodes = [];

    dragIds.forEach((dragId) => {
        const { nodes, node } = extractNode(updatedNodes, dragId);
        updatedNodes = nodes;
        if (node) {
            draggedNodes.push(node);
        }
    });

    if (parentId === null) {
        updatedNodes.splice(index, 0, ...draggedNodes);
    } else {
        updatedNodes = insertNodes(updatedNodes, parentId, draggedNodes, index);
    }

    return updatedNodes;
}

// Вспомогательная функция для рекурсивного поиска и удаления узла по id.
// Функция возвращает объект с обновлённым деревом (nodes) и извлечённым узлом (node).
function extractNode(nodes, nodeId) {
    let extracted = null;

    // Рекурсивная функция, которая обходит узлы и удаляет найденный узел
    const recursive = (items) => {
        return items.reduce((acc, node) => {
            if (node.id === nodeId) {
                // Если найден нужный узел, запоминаем его и не включаем в результирующий массив
                extracted = node;
                return acc;
            }
            // Если есть дочерние узлы – рекурсивно ищем в них
            if (node.children) {
                node = { ...node, children: recursive(node.children) };
            }
            return [...acc, node];
        }, []);
    };

    const newNodes = recursive(nodes);
    return { nodes: newNodes, node: extracted };
}

// Вспомогательная функция для рекурсивного поиска родительского узла по parentId
// и вставки новых узлов (nodesToInsert) в его массив children по указанному индексу.
function insertNodes(nodes, parentId, nodesToInsert, index) {
    return nodes.map((node) => {
        if (node.id === parentId) {
            // Находим массив дочерних узлов (если его нет – создаём)
            const children = node.children ? [...node.children] : [];
            // Вставляем новые узлы по заданному индексу
            children.splice(index, 0, ...nodesToInsert);
            return { ...node, children };
        }
        // Если узел имеет дочерние элементы – продолжаем поиск
        if (node.children) {
            return {
                ...node,
                children: insertNodes(
                    node.children,
                    parentId,
                    nodesToInsert,
                    index
                ),
            };
        }
        return node;
    });
}

export function renameNodeSettingUtil(setting, nodeId, name) {
    return {
        ...setting,
        [nodeId]: {
            ...setting[nodeId],
            name,
        },
    };
}

export function createSettingUtil(settings, nodeId, setting) {
    let result = { ...settings };
    if (setting.parentId !== null) {
        result = {
            ...result,
            [setting.parentId]: {
                ...result[setting.parentId],
                children: [...result[setting.parentId].children, nodeId],
            },
        };
    }
    return {
        ...result,
        [nodeId]: {
            id: nodeId,
            ...setting,
        },
    };
}

export function removeSettingUtil(settings, nodeIds) {
    let result = { ...settings };
    nodeIds.forEach((nodeId) => {
        if (result[nodeId].parentId !== null) {
            const parentId = result[nodeId].parentId;
            result = {
                ...result,
                [parentId]: {
                    ...result[parentId],
                    children: result[parentId].children.filter(
                        (id) => id !== nodeId
                    ),
                },
            };
        }
        if (result[nodeId].children?.length > 0) {
            result = removeSettingUtil(result, result[nodeId].children);
        }
        delete result[nodeId];
    });
    return { ...result };
}
