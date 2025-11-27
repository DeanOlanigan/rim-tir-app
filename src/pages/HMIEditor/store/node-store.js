import { create } from "zustand";
import { devtools } from "zustand/middleware";

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
        y: 0,
        points: [
            0, 25, 5, 25, 5, 30, 10, 30, 10, 25, 15, 25, 15, 30, 20, 30, 20, 25,
            25, 25, 25, 35, 0, 35,
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
        childrenIds: ["rect2", "line2", "group2"],
    },
    rect2: {
        id: "rect2",
        name: "rect2",
        type: "rect",
        x: 50,
        y: 50,
        width: 20,
        height: 20,
        fill: "#00ff2aff",
        stroke: "black",
        strokeWidth: 2,
        cornerRadius: 2,
    },
    line2: {
        id: "line2",
        name: "line2",
        type: "line",
        x: 0,
        y: 0,
        points: [50, 50, 40, 50],
        stroke: "black",
        strokeWidth: 1,
        lineCap: "round",
        lineJoin: "round",
    },
    group2: {
        id: "group2",
        name: "Группа2",
        type: "group",
        childrenIds: ["rect3", "ellipse1"],
    },
    rect3: {
        id: "rect3",
        name: "rect3",
        type: "rect",
        x: 50,
        y: 80,
        width: 20,
        height: 20,
        fill: "#ff0000ff",
    },
    ellipse1: {
        id: "ellipse1",
        name: "ellipse1",
        type: "ellipse",
        x: 80,
        y: 80,
        radiusX: 10,
        radiusY: 15,
        fill: "#0000ffff",
    },
};

const rootIds = ["rect1", "line1", "group1"];

const initialNodes2 = [
    {
        id: "rect1",
        parentId: null,
        name: "rect1",
        type: "rect",
        x: 0,
        y: 0,
        width: 20,
        height: 20,
        fill: "#fff",
        stroke: "black",
        strokeWidth: 2,
        cornerRadius: 2,
    },
    {
        id: "line1",
        parentId: null,
        name: "line1",
        type: "line",
        x: 0,
        y: 0,
        points: [
            0, 25, 5, 25, 5, 30, 10, 30, 10, 25, 15, 25, 15, 30, 20, 30, 20, 25,
            25, 25, 25, 35, 0, 35,
        ],
        stroke: "black",
        strokeWidth: 1,
        lineCap: "round",
        lineJoin: "round",
    },
    {
        id: "group1",
        parentId: null,
        name: "Группа",
        type: "group",
        children: [
            {
                id: "rect2",
                parentId: "group1",
                name: "rect2",
                type: "rect",
                x: 50,
                y: 50,
                width: 20,
                height: 20,
                fill: "#00ff2aff",
                stroke: "black",
                strokeWidth: 2,
                cornerRadius: 2,
            },
            {
                id: "line2",
                parentId: "group1",
                name: "line2",
                type: "line",
                x: 0,
                y: 0,
                points: [50, 50, 40, 50],
                stroke: "black",
                strokeWidth: 1,
                lineCap: "round",
                lineJoin: "round",
            },
            {
                id: "group2",
                parentId: "group1",
                name: "group2",
                type: "group",
                children: [
                    {
                        id: "rect3",
                        parentId: "group2",
                        name: "rect3",
                        type: "rect",
                        x: 50,
                        y: 80,
                        width: 20,
                        height: 20,
                        fill: "#ff0000ff",
                    },
                    {
                        id: "ellipse1",
                        parentId: "group2",
                        name: "ellipse1",
                        type: "ellipse",
                        x: 80,
                        y: 80,
                        radiusX: 10,
                        radiusY: 15,
                        fill: "#0000ffff",
                    },
                ],
            },
        ],
    },
];

export const useNodeStore = create(
    devtools(
        (set) => ({
            selectedIds: [],
            nodes: initialNodes,
            rootIds,
            addNode: (id, node) =>
                set((state) => ({
                    nodes: { ...state.nodes, [id]: node },
                    rootIds: [...state.rootIds, id],
                })),
            removeNode: (id) =>
                set((state) => {
                    const newNodes = { ...state.nodes };
                    delete newNodes[id];
                    return { nodes: newNodes };
                }),
            updateNode: (id, patch) =>
                set((state) => ({
                    nodes: {
                        ...state.nodes,
                        [id]: { ...state.nodes[id], ...patch },
                    },
                })),
            setSelectedIds: (ids) =>
                set((state) => {
                    const prev = state.selectedIds;
                    if (arraysEqual(prev, ids)) return state;
                    return { selectedIds: ids };
                }),
        }),
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
