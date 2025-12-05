import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { round4 } from "../utils";
import { SHAPES } from "../constants";

const initialNodes = {
    rect1: {
        id: "rect1",
        name: "rect1",
        type: "rect",
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        fill: "#fff",
        stroke: "black",
        strokeWidth: 2,
        fillAfterStrokeEnabled: true,
        cornerRadius: 2,
    },
    line1: {
        id: "line1",
        name: "line1",
        type: "line",
        x: 0,
        y: 25,
        points: [
            0, 0, 5, 0, 5, 5, 10, 5, 10, 0, 15, 0, 15, 5, 20, 5, 20, 0, 25, 0,
            25, 10, 0, 10,
        ],
        stroke: "black",
        strokeWidth: 1,
        lineCap: "round",
        lineJoin: "round",
    },
    group1: {
        id: "group1",
        name: "Группа",
        type: "group",
        x: 50,
        y: 50,
        childrenIds: ["rect2", "rect3"],
    },
    rect2: {
        id: "rect2",
        name: "rect2",
        type: "rect",
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        fill: "#00ff2aff",
    },
    rect3: {
        id: "rect3",
        name: "rect3",
        type: "rect",
        x: 0,
        y: 20,
        width: 20,
        height: 20,
        fill: "#ff0000ff",
    },
};
const rootIds = ["rect1", "line1", "group1"];

export const useNodeStore = create(
    devtools(
        persist(
            (set) => ({
                selectedIds: [],
                nodes: initialNodes,
                rootIds: rootIds,
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
                            (nid) => nid !== id
                        );
                        return { nodes: newNodes, rootIds: newRootIds };
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

                groupNodes: (ids, bbox) => {
                    set((state) => {
                        const id = nanoid(12);
                        const newRootIds = [...state.rootIds, id].filter(
                            (nid) => !ids.includes(nid)
                        );
                        const newNodes = {
                            ...state.nodes,
                            [id]: {
                                id,
                                type: SHAPES.group,
                                name: "Группа",
                                x: round4(bbox.x),
                                y: round4(bbox.y),
                                width: round4(bbox.width),
                                height: round4(bbox.height),
                                childrenIds: ids,
                            },
                        };
                        for (const id of ids) {
                            newNodes[id].x = newNodes[id].x - bbox.x;
                            newNodes[id].y = newNodes[id].y - bbox.y;
                        }
                        return {
                            rootIds: newRootIds,
                            nodes: newNodes,
                            selectedIds: [id],
                        };
                    });
                },

                ungroupNodes: (id) => {
                    set((state) => {
                        const node = state.nodes[id];
                        const type = node.type;
                        if (type !== SHAPES.group) return state;
                        const childrenIds = node.childrenIds;
                        const newRootIds = [
                            ...state.rootIds.filter((nid) => nid !== id),
                            ...childrenIds,
                        ];
                        const newNodes = { ...state.nodes };
                        for (const childId of childrenIds) {
                            newNodes[childId].x = newNodes[childId].x + node.x;
                            newNodes[childId].y = newNodes[childId].y + node.y;
                        }
                        delete newNodes[id];
                        return {
                            rootIds: newRootIds,
                            nodes: newNodes,
                            selectedIds: childrenIds,
                        };
                    });
                },

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
            }
        ),
        { name: "node-store" }
    )
);

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
