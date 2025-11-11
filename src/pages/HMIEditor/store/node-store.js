import { create } from "zustand";

const initialNodes = {
    rect1: {
        type: "rect",
        id: "rect1",
        x: 20,
        y: 20,
        width: 20,
        height: 20,
        fill: "#fff",
        stroke: "black",
        strokeWidth: 2,
        fillAfterStrokeEnabled: true,
        cornerRadius: 2,
    },
    circle1: {
        type: "circle",
        id: "circle1",
        x: 40,
        y: 40,
        radius: 10,
        fill: "#8fda93ff",
        stroke: "black",
        strokeWidth: 2,
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
