import { v4 as uuidv4 } from "uuid";

/* ================================================================= */
/* ======================== NODE OPERATIONS ======================== */
/* ================================================================= */

export function copyTreeUtil(treeApi, idSet, isCut) {
    function recursive(node) {
        const copiedData = { ...node.data };
        if (!isCut) {
            copiedData.name = copiedData.name + "_copy";
            if (copiedData.type === "dataObject") copiedData.name = "";
        }
        if (node.children?.length > 0) {
            return {
                ...copiedData,
                children: node.children.map(recursive),
            };
        }
        return copiedData;
    }
    const copy = [];
    for (const id of idSet) {
        copy.push(recursive(treeApi.get(id)));
    }
    return copy;
}

export function deleteNodeUtil(treeApi) {
    if (!treeApi.props.onDelete) return;
    const ids = Array.from(treeApi.selectedIds);
    if (ids.length > 1) {
        let nextFocus = treeApi.mostRecentNode;
        while (nextFocus && nextFocus.isSelected) {
            nextFocus = nextFocus.nextSibling;
        }
        if (!nextFocus) nextFocus = treeApi.lastNode;
        treeApi.focus(nextFocus, { scroll: false });
        const idsSet = getIdsSetWithoutNested(treeApi, ids);
        treeApi.delete(Array.from(idsSet));
    } else {
        const node = treeApi.focusedNode;
        if (node) {
            const sib = node.nextSibling;
            const parent = node.parent;
            treeApi.focus(sib || parent, { scroll: false });
            treeApi.delete(node);
        }
    }
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

export function ignoreNodeUtil(
    nodes,
    ids,
    ignore,
    aggregateToParents = true,
    ignoreParam
) {
    const idsSet = new Set(ids);

    function update(nodes) {
        return nodes.map((node) => {
            const shouldUpdate = idsSet.has(node.id);

            if (shouldUpdate) {
                /* const newChildren =
                    node.children?.length > 0
                        ? propogateIgnore(node.children, ignore, ignoreParam)
                        : node.children; */

                return {
                    ...node,
                    [ignoreParam]: ignore,
                    //...(newChildren && { children: newChildren }),
                };
            }

            let newChildren = node.children;
            if (node.children?.length > 0) {
                newChildren = update(node.children);
            }

            let newIsIgnored = node[ignoreParam];

            if (aggregateToParents && newChildren && newChildren.length > 0) {
                const allIgnored = newChildren.every(
                    (child) => child[ignoreParam]
                );
                newIsIgnored = allIgnored;
            }

            const isChildrenChanged = newChildren !== node.children;
            const isIgnoredChanged = newIsIgnored !== node[ignoreParam];

            if (!isChildrenChanged && !isIgnoredChanged) {
                return node;
            }

            return {
                ...node,
                ...(isIgnoredChanged && { [ignoreParam]: newIsIgnored }),
                ...(isChildrenChanged && { children: newChildren }),
            };
        });
    }

    function propogateIgnore(nodes, ignore, ignoreParam) {
        return nodes.map((node) => ({
            ...node,
            [ignoreParam]: ignore,
            ...(node.children?.length > 0 && {
                children: propogateIgnore(node.children, ignore, ignoreParam),
            }),
        }));
    }

    return update(nodes);
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
export function copySettingsUtil(settings, ids, isCut) {
    const copy = {};
    for (const id of ids) {
        copy[id] = {
            ...settings[id],
            setting: { ...settings[id].setting },
        };
        if (copy[id].type === "variable") copy[id].setting.usedIn = "";
        if (!isCut) {
            copy[id].name = copy[id].name + "_copy";
            if (copy[id].type === "dataObject")
                copy[id].setting.variableId = "";
        }
    }
    return copy;
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
/* ============================== UTILS ============================== */
/* ================================================================= */
export function getIdsSetNormalized(treeApi, ids) {
    const set = new Set();
    function recursive(id) {
        set.add(id);
        const node = treeApi.get(id);
        if (!node?.children?.length) return;
        for (const child of treeApi.get(id).children) {
            recursive(child.id);
        }
    }
    for (const id of ids) {
        recursive(id);
    }
    return set;
}

export function getIdsSetNormalizedContext(context, ids) {
    const set = new Set();
    const stack = [...ids];

    while (stack.length) {
        const id = stack.pop();
        if (set.has(id)) continue;
        set.add(id);
        const node = context[id];
        if (node?.children?.length) {
            for (const childId of node.children) stack.push(childId);
        }
    }

    return set;
}

export function getIdsSetWithoutNested(treeApi, ids) {
    const idSet = new Set(ids);
    function removeDescendants(id) {
        const node = treeApi.get(id);
        if (!node?.children?.length) return;
        for (const child of treeApi.get(id).children) {
            idSet.delete(child.id);
            removeDescendants(child.id);
        }
    }
    for (const id of ids) {
        removeDescendants(id);
    }
    return idSet;
}

export function generateNewIds(copyTree, copySettings, parentId, settings) {
    const idMap = new Map();
    const newSettings = {};

    function recursive(node) {
        const oldId = node.id;
        const newId = uuidv4();

        idMap.set(oldId, newId);

        const newNode = {
            ...node,
            id: newId,
            children: node.children?.map(recursive),
        };
        return newNode;
    }

    const newTree = copyTree.map(recursive);

    for (const [oldId, setting] of Object.entries(copySettings)) {
        const newId = idMap.get(oldId);
        const newParentId = idMap.get(setting.parentId) ?? null;

        if (setting.type === "dataObject" && setting.setting.variableId) {
            settings[setting.setting.variableId].setting.usedIn = newId;
        }

        /* const newChildren = setting.children
            ?.map((child) => idMap.get(child))
            .filter(Boolean); */

        newSettings[newId] = {
            ...setting,
            id: newId,
            parentId: newParentId,
            children: [],
        };
    }

    for (const rootNode of newTree) {
        const rootNodeId = rootNode.id;
        newSettings[rootNodeId] = {
            ...newSettings[rootNodeId],
            parentId: parentId,
        };
    }

    return {
        tree: newTree,
        settings: newSettings,
    };
}

export function getParentId(treeApi) {
    const { focusedNode, props } = treeApi;
    if (!focusedNode) return props.treeType;
    if (focusedNode.children) return focusedNode.id;
    if (focusedNode.parent.id === props.treeType) return props.treeType;
    return focusedNode.parent.id;
}
