import { create } from "zustand";

export const useNodeStore = create((set) => ({
    selectedIds: [],
    nodes: [],
    addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
    setSelectedIds: (ids) => set({ selectedIds: ids }),
}));
