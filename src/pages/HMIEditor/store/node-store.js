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
        points: [0, 25, 50, 25],
        stroke: "black",
        strokeWidth: 1,
        lineCap: "round",
        lineJoin: "round",
    },
};

export const useNodeStore = create((set) => ({
    selectedIds: [],
    nodes: initialNodes,
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
