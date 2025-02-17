import { create } from "zustand";

const addNodeRecursive = (nodes, parentId, newNode) => {
    nodes.map((node) => {
        if (node.id === parentId) {
            return { ...node, children: [...node.children, newNode] };
        }
        return { ...node, children: addNodeRecursive(node.children, parentId, newNode) };
    });
};

const updatedNodeRecursive = (nodes, nodeId, updatedData) => {
    return nodes.map((node) => {
        if (node.id === nodeId) {
            const updated = { ...node, ...updatedData };
            return updated;
        }
        if (node.children?.length > 0)
            return { ...node, children: updatedNodeRecursive(node.children, nodeId, updatedData) };
        return node;
    });
};

export const useVariablesStore = create((set, get) => ({
    variables: [],
    selectedNode: null,

    setSelectedNode: (node) => {
        set({ selectedNode: node });
    },

    addNode: (parentId, newNode) => {
        if (parentId === null) {
            set((state) => ({ variables: [...state.variables, newNode] }));
        } else {
            set((state) => ({
                variables: addNodeRecursive(state.variables, parentId, newNode),
            }));
        };
    },

    updateNode: (nodeId, updatedData) => {
        set((state) => ({
            variables: updatedNodeRecursive(state.variables, nodeId, updatedData),
            selectedNode: state.selectedNode && updatedNodeRecursive(state.selectedNode, nodeId, updatedData),
        }));
    },

    removeNode: (nodeId) => {
        set((state) => ({
            variables: state.variables.filter((node) => node.id !== nodeId)
        }));
    },

}));
