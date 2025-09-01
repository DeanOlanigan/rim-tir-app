export function moveNodesUtil(state, dragIds, parentId, index) {
    const dragIdsSet = new Set(dragIds);

    const { nodes: updatedNodes, extracted } = extractNodesAtOnce(
        state,
        dragIdsSet
    );

    const sameParentCount = extracted.reduce(
        (count, { oldParentId, oldIndex }) => {
            if (oldParentId === parentId && oldIndex < index) {
                return count + 1;
            }
            return count;
        },
        0
    );

    if (sameParentCount > 0) {
        index -= sameParentCount;
        if (index < 0) index = 0;
    }

    const nodesToInsert = extracted.map((items) => items.node);

    if (parentId === null) {
        const newRoot = [...updatedNodes];
        newRoot.splice(index, 0, ...nodesToInsert);
        return newRoot;
    } else {
        return insertNodes(updatedNodes, parentId, nodesToInsert, index);
    }
}

// Вспомогательная функция для рекурсивного поиска родительского узла по parentId
// и вставки новых узлов (nodesToInsert) в его массив children по указанному индексу.
function insertNodes(nodes, parentId, nodesToInsert, index) {
    console.log("insertNodes");
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

function extractNodesAtOnce(nodes, dragIdsSet, currentParentId = null) {
    const extracted = [];
    function recursive(items, parentId) {
        return items.reduce((acc, node, idx) => {
            if (dragIdsSet.has(node.id)) {
                extracted.push({
                    node,
                    oldIndex: idx,
                    oldParentId: parentId,
                });
                return acc;
            }
            if (node.children) {
                const newChildren = recursive(node.children, node.id);
                node = { ...node, children: newChildren };
            }
            return [...acc, node];
        }, []);
    }
    const newNodes = recursive(nodes, currentParentId);
    return {
        nodes: newNodes,
        extracted,
    };
}
