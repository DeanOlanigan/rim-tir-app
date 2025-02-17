import { create } from "zustand";

const addNodeRecursive = (nodes, parentId, newNode) => {
    nodes.map((node) => {
        if (node.id === parentId) {
            return { ...node, children: [...node.children, newNode] };
        }
        return { ...node, children: addNodeRecursive(node.children, parentId, newNode) };
    });
};

export const useVariablesStore = create((set, get) => ({
    variables: [],

    addNode: (parentId, newNode) => {
        if (parentId === null) {
            set((state) => ({ variables: [...state.variables, newNode] }));
        } else {
            set((state) => ({
                variables: addNodeRecursive(state.variables, parentId, newNode),
            }));
        };
    }

}));
