/* ================================================================= */
/* ======================== NODE OPERATIONS ======================== */
/* ================================================================= */
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

export function ignoreNodeUtil(nodes, ids, ignore) {
    const idsSet = new Set(ids);

    function update(nodes) {
        return nodes.map((node) => {
            const shouldUpdate = idsSet.has(node.id);

            if (shouldUpdate) {
                const newChildren =
                    node.children?.length > 0
                        ? propogateIgnore(node.children, ignore)
                        : node.children;

                return {
                    ...node,
                    isIgnored: ignore,
                    ...(newChildren && { children: newChildren }),
                };
            }

            let newChildren = node.children;
            if (node.children?.length > 0) {
                newChildren = update(node.children);
            }

            let newIsIgnored = node.isIgnored;

            if (newChildren && newChildren.length > 0) {
                const allIgnored = newChildren.every(
                    (child) => child.isIgnored
                );
                newIsIgnored = allIgnored;
            }

            const isChildrenChanged = newChildren !== node.children;
            const isIgnoredChanged = newIsIgnored !== node.isIgnored;

            if (!isChildrenChanged && !isIgnoredChanged) {
                return node;
            }

            return {
                ...node,
                ...(isIgnoredChanged && { isIgnored: newIsIgnored }),
                ...(isChildrenChanged && { children: newChildren }),
            };
        });
    }

    function propogateIgnore(nodes, ignore) {
        return nodes.map((node) => ({
            ...node,
            isIgnored: ignore,
            ...(node.children?.length > 0 && {
                children: propogateIgnore(node.children, ignore),
            }),
        }));
    }

    return update(nodes);
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

/* ================================================================= */
/* ====================== SETTINGS OPERATIONS ====================== */
/* ================================================================= */
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

export function renameNodeSettingUtil(setting, nodeId, name) {
    return {
        ...setting,
        [nodeId]: {
            ...setting[nodeId],
            name,
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

export function editSettingUtil(settings, nodeId, setting) {
    return {
        ...settings,
        [nodeId]: {
            ...settings[nodeId],
            setting: {
                ...settings[nodeId].setting,
                ...setting,
            },
        },
    };
}

export function editSettingNodeUtil(settings, nodeId, setting) {
    return {
        ...settings,
        [nodeId]: {
            ...settings[nodeId],
            ...setting,
        },
    };
}

export function bindVariableUtil(settings, nodeId, variableId) {
    return {
        ...settings,
        [nodeId]: {
            ...settings[nodeId],
            variableId: variableId,
        },
        [variableId]: {
            ...settings[variableId],
            usedIn: nodeId,
        },
    };
}

export function bindVariableToNodeUtil(receive, send, nodeId, variableId) {
    const recursive = (nodes, nodeId) => {
        return nodes.map((node) => {
            if (node.id === nodeId) {
                return { ...node, name: variableId };
            }
            if (node.children?.length > 0) {
                return { ...node, children: recursive(node.children, nodeId) };
            }
            return node;
        });
    };
    const receiveNew = recursive(receive, nodeId);
    const sendNew = recursive(send, nodeId);
    return { receive: receiveNew, send: sendNew };
}

export function unbindVariableUtil(settings, nodeId) {
    let result = { ...settings };

    const recursive = (nodeId) => {
        const node = result[nodeId];

        if (Array.isArray(node.children) && node.children?.length > 0) {
            for (const childId of node.children) {
                recursive(childId);
            }
        }

        if (node.variableId) {
            const varId = node.variableId;
            result = {
                ...result,
                [varId]: {
                    ...result[varId],
                    usedIn: null,
                },
            };
        }

        result = {
            ...result,
            [nodeId]: {
                ...node,
                variableId: null,
            },
        };
    };

    recursive(nodeId);
    return result;

    /* if (result[nodeId].variableId) {
        result = {
            ...result,
            [result[nodeId].variableId]: {
                ...result[result[nodeId].variableId],
                usedIn: null,
            },
        };
    }
    return {
        ...result,
        [nodeId]: {
            ...result[nodeId],
            variableId: null,
        },
    }; */
}

export function moveSettingUtil(settings, dragIds, parentId, index) {
    // 1) Сохраняем неизменённый settings для вычисления oldIndex
    const original = settings;

    // 2) Корректируем index так же, как в moveNodesUtil:
    const sameParentCount = dragIds.reduce((count, dragId) => {
        const oldParent = original[dragId].parentId;
        if (oldParent === parentId) {
            const oldIndex = original[oldParent]?.children?.indexOf(dragId);
            if (oldIndex != null && oldIndex < index) {
                return count + 1;
            }
        }
        return count;
    }, 0);
    // сдвиг вниз
    let insertPos = index - sameParentCount;
    if (insertPos < 0) insertPos = 0;

    let updatedSettings = { ...settings };
    dragIds.forEach((dragId) => {
        if (dragId === parentId) return;

        const draggedNode = updatedSettings[dragId];
        const parent = draggedNode.parentId;

        //if (parent === parentId) return;

        if (parent && updatedSettings[parent]?.children) {
            const filteredChildren = updatedSettings[parent].children.filter(
                (child) => child !== dragId
            );

            updatedSettings = {
                ...updatedSettings,
                [parent]: {
                    ...updatedSettings[parent],
                    children: filteredChildren,
                },
            };
        }

        const updatedDragNode = {
            ...draggedNode,
            parentId: parentId,
        };

        updatedSettings = {
            ...updatedSettings,
            [dragId]: updatedDragNode,
        };

        if (parentId !== null) {
            const newParentChildren = updatedSettings[parentId]?.children ?? [];
            const before = newParentChildren.slice(0, insertPos);
            const after = newParentChildren.slice(insertPos);
            const child = [...before, dragId, ...after];

            updatedSettings = {
                ...updatedSettings,
                //[dragId]: updatedDragNode,
                [parentId]: {
                    ...updatedSettings[parentId],
                    children: child,
                },
            };
            insertPos++;
        } /*  else {
            updatedSettings = {
                ...updatedSettings,
                [dragId]: updatedDragNode,
            };
        } */
    });
    return updatedSettings;
}

/* ================================================================= */
/* ============================== OLD ============================== */
/* ================================================================= */
export function moveNodeUtil(state, dragIds, parentId, index) {
    let updatedNodes = [...state];
    const draggedNodes = [];

    dragIds.forEach((dragId) => {
        const { nodes, node, oldParentId, oldIndex } = extractNode(
            updatedNodes,
            dragId
        );
        updatedNodes = nodes;
        if (node) {
            draggedNodes.push({ node, oldParentId, oldIndex });
        }
    });

    if (draggedNodes.length === 1) {
        const { node, oldParentId, oldIndex } = draggedNodes[0];

        if (oldParentId === parentId && oldIndex < index) {
            index--;
        }

        if (parentId === null) {
            updatedNodes.splice(index, 0, node);
        } else {
            updatedNodes = insertNodes(updatedNodes, parentId, [node], index);
        }
    }

    return updatedNodes;
}

// Вспомогательная функция для рекурсивного поиска и удаления узла по id.
// Функция возвращает объект с обновлённым деревом (nodes) и извлечённым узлом (node).
function extractNode(nodes, nodeId, parentId = null) {
    console.log("extractNode");
    let extracted = null;
    let oldIndex = -1;
    let extractedParentId = null;

    // Рекурсивная функция, которая обходит узлы и удаляет найденный узел
    const recursive = (items, currentParentId) => {
        return items.reduce((acc, node, idx) => {
            if (node.id === nodeId) {
                // Если найден нужный узел, запоминаем его и не включаем в результирующий массив
                extracted = node;
                oldIndex = idx;
                extractedParentId = currentParentId;
                return acc;
            }
            // Если есть дочерние узлы – рекурсивно ищем в них
            if (node.children) {
                node = { ...node, children: recursive(node.children, node.id) };
            }
            return [...acc, node];
        }, []);
    };

    const newNodes = recursive(nodes, parentId);
    return {
        nodes: newNodes,
        node: extracted,
        oldIndex,
        oldParentId: extractedParentId,
    };
}
