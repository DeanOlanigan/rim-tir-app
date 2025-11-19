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
    /* ellipse1: {
        type: "ellipse",
        id: "ellipse1",
        x: 50,
        y: 25,
        radiusX: 12.5,
        radiusY: 12.5,
        fill: "#8fda93ff",
        stroke: "black",
        strokeWidth: 0,
        fillAfterStrokeEnabled: true,
    }, */
};

export const useNodeStore = create((set) => ({
    selectedIds: [],
    nodes: initialNodes,
    addNode: (id, node) =>
        set((state) => ({ nodes: { ...state.nodes, [id]: node } })),
    removeNode: (id) =>
        set((state) => {
            const { [id]: _, ...nodes } = state.nodes;
            return { nodes };
        }),
    updateNode: (id, patch) =>
        set((state) => ({
            nodes: { ...state.nodes, [id]: { ...state.nodes[id], ...patch } },
        })),
    setSelectedIds: (ids) => set({ selectedIds: ids }),
}));
