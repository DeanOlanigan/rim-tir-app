import { create } from "zustand";

const initialNodes = {
    rect1: {
        type: "rect",
        id: "rect1",
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
    rect2: {
        type: "rect",
        id: "rect2",
        x: 25,
        y: 0,
        width: 20,
        height: 20,
        fill: "#fff",
        stroke: "black",
        strokeWidth: 2,
        fillAfterStrokeEnabled: false,
        cornerRadius: 2,
    },
    rect3: {
        type: "rect",
        id: "rect3",
        x: 50,
        y: 0,
        width: 20,
        height: 20,
        fill: "#fff",
        stroke: "black",
        strokeWidth: 0,
        fillAfterStrokeEnabled: true,
        cornerRadius: 2,
    },
    rect4: {
        type: "rect",
        id: "rect4",
        x: 75,
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
        type: "line",
        id: "line1",
        x: 0,
        y: 0,
        points: [
            0, 25, 5, 25, 5, 30, 10, 30, 10, 25, 15, 25, 15, 30, 20, 30, 20, 25,
            25, 25, 25, 35, 0, 35, 0, 25,
        ],
        closed: true,
        stroke: "black",
        strokeWidth: 1,
        lineCap: "round",
        lineJoin: "round",
    },
};

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

export const useNodeStore = create((set) => ({
    selectedIds: [],
    nodes: initialNodes2,
    addNode: (id, node) =>
        set((state) => ({ nodes: { ...state.nodes, [id]: node } })),
    removeNode: (id) =>
        set((state) => {
            const newNodes = { ...state.nodes };
            delete newNodes[id];
            return { nodes: newNodes };
        }),
    updateNode: (id, patch) =>
        set((state) => ({
            nodes: { ...state.nodes, [id]: { ...state.nodes[id], ...patch } },
        })),
    setSelectedIds: (ids) =>
        set((state) => {
            const prev = state.selectedIds;
            if (arraysEqual(prev, ids)) return state;
            return { selectedIds: ids };
        }),
}));

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
