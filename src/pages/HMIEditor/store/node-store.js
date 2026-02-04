import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { nanoid } from "nanoid";
import { decomposeTR, isHasRadius, mul, nodeLocalMatrix } from "../utils";
import { SHAPES } from "../constants";

const defaultPageId = "page-1";
const defaultPage = {
    id: defaultPageId,
    name: "Page 1",
    rootIds: [],
    type: "SCREEN",
    backgroundColor: "#254e25ff",
};
const defaultPages = {
    [defaultPageId]: defaultPage,
};
const defaultProjectName = "New project";

export const useNodeStore = create(
    devtools(
        (set, get) => ({
            // ---- META ----
            meta: {
                mode: "new",
                filename: "untitled",
                isDirty: false,
            },
            makeDirty: () =>
                set((state) => ({
                    meta: { ...state.meta, isDirty: true },
                })),
            // ---- PROJECT ----
            projectName: defaultProjectName,
            renameProject: (name) =>
                set((state) => {
                    const prev = state.projectName;
                    if (prev === name) return state;
                    return { projectName: name };
                }),
            // ---- UI делишки ----
            selectedIds: [],
            setSelectedIds: (ids) =>
                set((state) => {
                    const prev = state.selectedIds;
                    if (arraysEqual(prev, ids)) return state;
                    return { selectedIds: ids };
                }),
            close: () =>
                set(() => ({
                    projectName: defaultProjectName,
                    nodes: {},
                    pages: defaultPages,
                    activePageId: defaultPageId,
                    selectedIds: [],
                    meta: { mode: "new", filename: "untitled", isDirty: false },
                })),
            open: (project, mode = "new", filename = "untitled") =>
                set(() => ({
                    projectName: project.projectName,
                    nodes: project.nodes,
                    pages: project.pages,
                    activePageId: project.activePageId,
                    selectedIds: [],
                    meta: { mode, filename, isDirty: false },
                })),

            // ---- PAGES ----
            activePageId: defaultPageId,
            pages: defaultPages,
            setActivePage: (pageId) =>
                set((state) => {
                    const prev = state.activePageId;
                    if (prev === pageId) return state;
                    return { activePageId: pageId, selectedIds: [] };
                }),
            addPage: (name = "New page", type = "SCREEN") =>
                set((state) => {
                    const id = nanoid(12);
                    return {
                        pages: {
                            ...state.pages,
                            [id]: {
                                id,
                                name,
                                rootIds: [],
                                type,
                                backgroundColor: "#254e25ff",
                            },
                        },
                        activePageId: id,
                        selectedIds: [],
                    };
                }),
            updatePage: (pageId, patch) =>
                set((state) => ({
                    pages: {
                        ...state.pages,
                        [pageId]: { ...state.pages[pageId], ...patch },
                    },
                })),
            removePage: (pageId) =>
                set((state) => {
                    const page = state.pages[pageId];
                    if (!page) return state;

                    const nodesToDelete = [];
                    page.rootIds.forEach((id) => {
                        collectAllDescendants(id, state.nodes, nodesToDelete);
                    });

                    const newNodes = { ...state.nodes };
                    nodesToDelete.forEach((id) => delete newNodes[id]);

                    const newPages = { ...state.pages };
                    delete newPages[pageId];

                    let newActiveId = state.activePageId;
                    if (state.activePageId === pageId) {
                        const remainingIds = Object.keys(newPages);
                        newActiveId =
                            remainingIds.length > 0 ? remainingIds[0] : null;
                    }

                    if (!newActiveId) {
                        const newId = "page-1";
                        newPages[newId] = {
                            id: newId,
                            name: "Page 1",
                            type: "SCREEN",
                            rootIds: [],
                            backgroundColor: "#254e25ff",
                        };
                        newActiveId = newId;
                    }

                    const newVarIndex = {};
                    Object.values(newNodes).forEach((node) =>
                        addNodeToIndex(newVarIndex, node),
                    );

                    return {
                        pages: newPages,
                        nodes: newNodes,
                        activePageId: newActiveId,
                        selectedIds: [],
                        varIndex: newVarIndex,
                    };
                }),

            // ---- NODES ----
            nodes: {},
            addNode: (node) =>
                set((state) => {
                    const pageId = state.activePageId;
                    const page = state.pages[pageId];
                    if (!page) return state;

                    const id = nanoid(12);
                    const newNode = {
                        ...node,
                        id,
                        bindings: {
                            globalVarId: null,
                            items: [],
                        },
                        events: {
                            onClick: [],
                            onContextMenu: [],
                            onDoubleClick: [],
                            onMouseDown: [],
                            onMouseUp: [],
                        },
                    };
                    const nodes = { ...state.nodes, [id]: newNode };
                    const updatedPage = {
                        ...page,
                        rootIds: [...page.rootIds, id],
                    };

                    return {
                        nodes,
                        pages: { ...state.pages, [pageId]: updatedPage },
                        selectedIds: [id],
                    };
                }),
            removeNode: (id) =>
                set((state) => {
                    const pageId = state.activePageId;
                    const page = state.pages[pageId];
                    if (!page) return state;

                    const newNodes = { ...state.nodes };
                    delete newNodes[id];

                    const newRootIds = page.rootIds.filter((nid) => nid !== id);

                    return {
                        nodes: newNodes,
                        pages: {
                            ...state.pages,
                            [pageId]: {
                                ...page,
                                rootIds: newRootIds,
                            },
                        },
                        selectedIds: [],
                    };
                }),
            removeNodes: (ids) =>
                set((state) => {
                    const pageId = state.activePageId;
                    const page = state.pages[pageId];
                    if (!page) return state;

                    const newNodes = { ...state.nodes };
                    ids.forEach((id) => {
                        delete newNodes[id];
                    });

                    const newRootIds = page.rootIds.filter(
                        (nid) => !ids.includes(nid),
                    );

                    return {
                        nodes: newNodes,
                        pages: {
                            ...state.pages,
                            [pageId]: {
                                ...page,
                                rootIds: newRootIds,
                            },
                        },
                        selectedIds: [],
                    };
                }),
            updateNode: (id, patch) =>
                set((state) => ({
                    nodes: {
                        ...state.nodes,
                        [id]: { ...state.nodes[id], ...patch },
                    },
                })),
            updateNodes: (ids, patchesById) =>
                set((state) => ({
                    nodes: {
                        ...state.nodes,
                        ...ids.reduce((acc, id) => {
                            const patch = patchesById[id];
                            if (!patch) return acc;
                            acc[id] = { ...state.nodes[id], ...patch };
                            return acc;
                        }, {}),
                    },
                })),

            // ---- GROUPS ----
            groupNodes: (ids, bbox) => set((state) => group(ids, bbox, state)),
            ungroupNodes: (id) => set((state) => ungroup([id], state)),
            ungroupMultipleNodes: (ids) => set((state) => ungroup(ids, state)),
            duplicateNodes: (ids) => set((state) => deepDuplicate(ids, state)),

            // ---- Создание индекса для константного поиска нужного примитива по его id ----
            varIndex: {},
            rebuildVarIndex: () => {
                const { nodes } = get();
                const newVarIndex = {};
                Object.values(nodes).forEach((node) =>
                    addNodeToIndex(newVarIndex, node),
                );
                set({ varIndex: newVarIndex });
            },

            // ---- Экшены привязки значений переменных к параметрам примитивов ----
            setBindingGlobalVarId: (ids, varIdOrNull) => {
                set((s) => {
                    const newNodes = { ...s.nodes };
                    const newVarIndex = { ...s.varIndex };
                    ids.forEach((id) => {
                        const node = newNodes[id];
                        if (!node) return;

                        removeNodeFromIndex(newVarIndex, id);

                        newNodes[id] = {
                            ...node,
                            bindings: {
                                ...node.bindings,
                                globalVarId: varIdOrNull,
                            },
                        };

                        addNodeToIndex(newVarIndex, newNodes[id]);
                    });
                    return { nodes: newNodes, varIndex: newVarIndex };
                });
            },
            updateBinding: (nodeIds, property, changes) =>
                set((state) => {
                    const newNodes = { ...state.nodes };
                    const newIndex = { ...state.varIndex };

                    nodeIds.forEach((id) => {
                        updateBindingFunc(
                            newNodes,
                            newIndex,
                            id,
                            property,
                            changes,
                        );
                    });

                    return { nodes: newNodes, varIndex: newIndex };
                }),
            removeBinding: (ids, property) => {
                set((s) => {
                    const newNodes = { ...s.nodes };
                    ids.forEach((id) => {
                        removeBindingFunc(newNodes, id, property);
                    });
                    return { nodes: newNodes };
                });
            },

            // ---- Экшены привязки действий к примитивам ----
            // 1. Добавить новое действие в конец списка
            addNodeEventAction: (nodeId, eventType, action) =>
                set((state) => {
                    const node = state.nodes[nodeId];
                    if (!node) return state;

                    const currentActions = node.events?.[eventType] || [];

                    return {
                        nodes: {
                            ...state.nodes,
                            [nodeId]: {
                                ...node,
                                events: {
                                    ...node.events,
                                    [eventType]: [...currentActions, action],
                                },
                            },
                        },
                    };
                }),
            // 2. Обновить конкретное действие (по patch.id)
            updateNodeEventAction: (nodeId, eventType, patch) =>
                set((state) => {
                    const node = state.nodes[nodeId];
                    if (!node) return state;

                    const currentActions = node.events?.[eventType] || [];

                    // Находим и обновляем нужное действие
                    const newActions = currentActions.map((a) =>
                        a.id === patch.id ? { ...a, ...patch } : a,
                    );

                    return {
                        nodes: {
                            ...state.nodes,
                            [nodeId]: {
                                ...node,
                                events: {
                                    ...node.events,
                                    [eventType]: newActions,
                                },
                            },
                        },
                    };
                }),
            // 3. Удалить действие
            removeNodeEventAction: (nodeId, eventType, actionId) =>
                set((state) => {
                    const node = state.nodes[nodeId];
                    if (!node) return state;

                    const currentActions = node.events?.[eventType] || [];

                    return {
                        nodes: {
                            ...state.nodes,
                            [nodeId]: {
                                ...node,
                                events: {
                                    ...node.events,
                                    [eventType]: currentActions.filter(
                                        (a) => a.id !== actionId,
                                    ),
                                },
                            },
                        },
                    };
                }),
            // 4. Перезаписать весь список действий для события
            // (Используется для Drag-and-Drop сортировки)
            setNodeEventActions: (nodeId, eventType, newActions) =>
                set((state) => {
                    const node = state.nodes[nodeId];
                    if (!node) return state;

                    return {
                        nodes: {
                            ...state.nodes,
                            [nodeId]: {
                                ...node,
                                events: {
                                    ...node.events,
                                    [eventType]: newActions,
                                },
                            },
                        },
                    };
                }),
        }),
        { name: "node-store" },
    ),
);

function deepDuplicate(ids, state, opts = {}) {
    const pageId = state.activePageId;
    const page = state.pages[pageId];
    if (!page) return state;

    const {
        offset = { x: 1, y: 1 }, // чуть сдвинуть копию, чтобы было видно
        groupType = SHAPES.group,
    } = opts;

    const newNodes = { ...state.nodes };
    const newIndex = { ...state.varIndex };
    const newRootIds = [...page.rootIds];
    const newSelectedIds = [];

    const selected = new Set(ids);

    // На всякий случай, если в ids будут id, которые уже есть в выбранной группе
    const topLevelIds = ids.filter((id) => {
        let cur = state.nodes[id]?.parentId;
        while (cur) {
            if (selected.has(cur)) return false;
            cur = state.nodes[cur]?.parentId;
        }
        return true;
    });

    function cloneSubTree(oldId, applyOffset) {
        const oldNode = state.nodes[oldId];
        if (!oldNode) return;

        const newId = nanoid(12);

        const baseClone = {
            ...oldNode,
            id: newId,
        };

        if (applyOffset) {
            if (typeof baseClone.x === "number") baseClone.x += offset.x;
            if (typeof baseClone.y === "number") baseClone.y += offset.y;
        }

        if (oldNode.type === groupType) {
            const oldChildren = Array.isArray(oldNode.childrenIds)
                ? oldNode.childrenIds
                : [];
            baseClone.childrenIds = [];

            newNodes[newId] = baseClone;

            for (const childOldId of oldChildren) {
                const childNewId = cloneSubTree(childOldId, false);
                if (childNewId) baseClone.childrenIds.push(childNewId);
            }

            newNodes[newId] = {
                ...baseClone,
                childrenIds: [...baseClone.childrenIds],
            };
        } else {
            newNodes[newId] = baseClone;
        }
        addNodeToIndex(newIndex, newNodes[newId]);
        return newId;
    }

    for (const id of topLevelIds) {
        const newId = cloneSubTree(id, true);
        newRootIds.push(newId);
        if (newId) newSelectedIds.push(newId);
    }

    return {
        nodes: newNodes,
        pages: {
            ...state.pages,
            [pageId]: {
                ...page,
                rootIds: newRootIds,
            },
        },
        selectedIds: newSelectedIds,
        varIndex: newIndex,
    };
}

function ungroup(ids, state) {
    const pageId = state.activePageId;
    const page = state.pages[pageId];
    if (!page) return state;

    let newRootIds = [...page.rootIds];
    const newNodes = { ...state.nodes };
    const newIndex = { ...state.varIndex };

    const selectedIds = [];

    for (const id of ids) {
        const groupNode = state.nodes[id];
        if (!groupNode || groupNode.type !== SHAPES.group) continue;

        removeNodeFromIndex(newIndex, id);

        const groupChildren = Array.isArray(groupNode.childrenIds)
            ? groupNode.childrenIds
            : [];

        newRootIds = newRootIds.filter((nid) => nid !== id);
        const G = nodeLocalMatrix(groupNode);

        for (const childId of groupChildren) {
            const child = state.nodes[childId];
            if (!child) continue;

            const { x, y, rotation } = calcChildTransform(G, child);

            newNodes[childId] = {
                ...child,
                x,
                y,
                rotation,
            };

            selectedIds.push(childId);
            if (!newRootIds.includes(childId)) newRootIds.push(childId);
        }

        delete newNodes[id];
    }

    return {
        pages: {
            ...state.pages,
            [pageId]: {
                ...page,
                rootIds: newRootIds,
            },
        },
        nodes: newNodes,
        selectedIds: selectedIds,
        varIndex: newIndex,
    };
}

function calcChildTransform(groupMatrix, child) {
    const C = nodeLocalMatrix(child);
    const W = mul(groupMatrix, C);
    const { x, y, rotation } = decomposeTR(W);

    let newX = x;
    let newY = y;
    if (isHasRadius(child.type)) {
        newX = newX - child.width / 2;
        newY = newY - child.height / 2;
    }
    return {
        x: newX,
        y: newY,
        rotation,
    };
}

function group(ids, bbox, state) {
    const pageId = state.activePageId;
    const page = state.pages[pageId];
    if (!page) return state;

    const groupId = nanoid(12);

    const groupNode = {
        id: groupId,
        type: SHAPES.group,
        name: "Группа",
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height,
        opacity: 1,
        visible: true,
        rotation: 0,
        childrenIds: [...ids],
        bindings: {
            globalVarId: null,
            items: [],
        },
        events: {
            onClick: [],
            onContextMenu: [],
            onDoubleClick: [],
            onMouseDown: [],
            onMouseUp: [],
        },
    };

    const newRootIds = [...page.rootIds]
        .filter((nid) => !ids.includes(nid))
        .concat(groupId);

    const newNodes = { ...state.nodes };
    const newIndex = { ...state.varIndex };

    addNodeToIndex(newIndex, groupNode);

    for (const childId of ids) {
        const child = state.nodes[childId];
        if (!child) continue;

        newNodes[childId] = {
            ...child,
            x: (child.x ?? 0) - groupNode.x,
            y: (child.y ?? 0) - groupNode.y,
        };
    }

    newNodes[groupId] = groupNode;

    return {
        pages: {
            ...state.pages,
            [pageId]: {
                ...page,
                rootIds: newRootIds,
            },
        },
        nodes: newNodes,
        selectedIds: [groupId],
        varIndex: newIndex,
    };
}

export function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export const patchStoreRaf = (() => {
    let queuedIds = new Set();
    let queuedPatch = {};
    let frame = null;

    const flush = () => {
        if (!queuedIds.size) {
            frame = null;
            return;
        }

        const ids = Array.from(queuedIds);
        const patchById = queuedPatch;

        queuedIds = new Set();
        queuedPatch = {};
        frame = null;
        useNodeStore.getState().updateNodes(ids, patchById);
    };

    return (ids, patchById) => {
        ids.forEach((id) => {
            queuedIds.add(id);
            queuedPatch[id] = {
                ...(queuedPatch[id] || {}),
                ...(patchById[id] || {}),
            };
        });

        if (!frame) {
            frame = requestAnimationFrame(flush);
        }
    };
})();

function addNodeToIndex(index, node) {
    const items = node.bindings?.items ?? [];
    const globalVarId = node.bindings?.globalVarId;

    items.forEach((b) => {
        let varId;
        if (b.enabled) varId = b.useGlobal ? globalVarId : b.varId;
        if (varId) {
            if (!index[varId]) index[varId] = [];
            index[varId].push({
                nodeId: node.id,
                prop: b.property,
                bindingId: b.id,
            });
        }
    });
}

function removeNodeFromIndex(index, nodeId) {
    for (const varId in index) {
        index[varId] = index[varId].filter((b) => b.nodeId !== nodeId);
        if (index[varId].length === 0) delete index[varId];
    }
}

function updateBindingFunc(newNodes, newIndex, id, property, changes) {
    const node = newNodes[id];
    if (!node || !node.bindings) return;

    removeNodeFromIndex(newIndex, id);

    const newItems = [...node.bindings.items];
    // Пытаемся найти биндинг с таким же property, а не id!
    // Т.к. у разных нод id биндингов могут отличаться (или быть одинаковыми, как решишь),
    // но логичнее искать по свойству (property: 'fill').

    // ВАЖНО: Мы ищем биндинг по свойству, которое мы редактируем
    // (changes должно содержать property, либо bindingId должен быть ключом свойства)

    const index = newItems.findIndex((b) => b.property === property);

    if (index !== -1) {
        // Обновляем существующий
        newItems[index] = {
            ...newItems[index],
            ...changes,
        };
    } else {
        // Если у второго элемента не было такого биндинга - создаем
        // (но тут нужно быть аккуратным с id)
        newItems.push({
            id: nanoid(12),
            property,
            enabled: true,
            useGlobal: true,
            mode: "map",
            rules: [],
            ...changes,
        });
    }

    newNodes[id] = {
        ...node,
        bindings: { ...node.bindings, items: newItems },
    };

    addNodeToIndex(newIndex, newNodes[id]);
}

function removeBindingFunc(newNodes, id, property) {
    const node = newNodes[id];
    if (!node || !node.bindings) return;

    newNodes[id] = {
        ...node,
        bindings: {
            ...node.bindings,
            items: node.bindings.items.filter((b) => b.property !== property),
        },
    };
}

const collectAllDescendants = (nodeId, nodes, acc = []) => {
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
