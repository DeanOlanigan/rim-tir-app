import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { decomposeTR, isHasRadius, mul, nodeLocalMatrix } from "../utils";
import { SHAPES } from "../constants";

export const useNodeStore = create(
    devtools(
        persist(
            (set) => ({
                selectedIds: [],
                nodes: {},
                rootIds: [],
                addNode: (node) =>
                    set((state) => {
                        const id = nanoid(12);
                        const newNode = { ...node, id };
                        return {
                            nodes: { ...state.nodes, [id]: newNode },
                            rootIds: [...state.rootIds, id],
                            selectedIds: [id],
                        };
                    }),
                setRootIds: (ids) => set(() => ({ rootIds: ids })),
                removeNode: (id) =>
                    set((state) => {
                        const newNodes = { ...state.nodes };
                        delete newNodes[id];
                        const newRootIds = state.rootIds.filter(
                            (nid) => nid !== id,
                        );
                        return {
                            nodes: newNodes,
                            rootIds: newRootIds,
                            selectedIds: [],
                        };
                    }),
                removeNodes: (ids) =>
                    set((state) => {
                        const newNodes = { ...state.nodes };
                        ids.forEach((id) => {
                            delete newNodes[id];
                        });
                        const newRootIds = state.rootIds.filter(
                            (nid) => !ids.includes(nid),
                        );
                        return {
                            nodes: newNodes,
                            rootIds: newRootIds,
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
                groupNodes: (ids, bbox) =>
                    set((state) => group(ids, bbox, state)),
                ungroupNodes: (id) => set((state) => ungroup([id], state)),
                ungroupMultipleNodes: (ids) =>
                    set((state) => ungroup(ids, state)),
                duplicateNodes: (ids) =>
                    set((state) => deepDuplicate(ids, state)),
                setSelectedIds: (ids) =>
                    set((state) => {
                        const prev = state.selectedIds;
                        if (arraysEqual(prev, ids)) return state;
                        return { selectedIds: ids };
                    }),
            }),
            {
                name: "hmi-node-store",
                partialize: (state) => ({
                    nodes: state.nodes,
                    rootIds: state.rootIds,
                }),
            },
        ),
        { name: "node-store" },
    ),
);

function deepDuplicate(ids, state, opts = {}) {
    const {
        offset = { x: 1, y: 1 }, // чуть сдвинуть копию, чтобы было видно
        groupType = SHAPES.group,
    } = opts;

    const newNodes = { ...state.nodes };
    const newRootIds = [...state.rootIds];
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
        return newId;
    }

    for (const id of topLevelIds) {
        const newId = cloneSubTree(id, true);
        newRootIds.push(newId);
        if (newId) newSelectedIds.push(newId);
    }

    return {
        nodes: newNodes,
        rootIds: newRootIds,
        selectedIds: newSelectedIds,
    };
}

function ungroup(ids, state) {
    let newRootIds = [...state.rootIds];
    const newNodes = { ...state.nodes };

    const selectedIds = [];

    for (const id of ids) {
        const groupNode = state.nodes[id];
        if (!groupNode || groupNode.type !== SHAPES.group) continue;

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
        rootIds: newRootIds,
        nodes: newNodes,
        selectedIds: selectedIds,
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
    const groupId = nanoid(12);

    const groupNode = {
        id: groupId,
        type: SHAPES.group,
        name: "Группа",
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height,
        rotation: 0,
        childrenIds: [...ids],
    };

    const newRootIds = [...state.rootIds]
        .filter((nid) => !ids.includes(nid))
        .concat(groupId);

    const newNodes = { ...state.nodes };

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
        rootIds: newRootIds,
        nodes: newNodes,
        selectedIds: [groupId],
    };
}

function arraysEqual(a, b) {
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
