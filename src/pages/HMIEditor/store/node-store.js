import { create } from "zustand";

const initialNodes = {
    rect1: {
        type: "rect",
        id: "rect1",
        x: 25,
        y: 25,
        width: 25,
        height: 25,
        fill: "#fff",
        stroke: "black",
        strokeWidth: 2,
        fillAfterStrokeEnabled: true,
        cornerRadius: 2,
    },
    ellipse1: {
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
    },
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
    updateNode: (id, node) =>
        set((state) => ({ nodes: { ...state.nodes, [id]: node } })),
    setSelectedIds: (ids) => set({ selectedIds: ids }),
}));
