import { create } from "zustand";

const addNodeRecursive = (nodes, parentId, newNode, index) => {
    return nodes.map((node) => {
        if (node.id === parentId) {
            const newVariables = [...node.children];
            newVariables.splice(index, 0, newNode);
            return { ...node, children: newVariables };
        }
        if (node.children?.length > 0) {
            return { ...node, children: addNodeRecursive(node.children, parentId, newNode, index) };
        }
        return node;
    });
};

const updatedNodeRecursive = (nodes, nodeId, updatedData) => {
    return nodes.map((node) => {
        if (node.id === nodeId) {
            const updated = {
                ...node,
                ...updatedData,
                setting: updatedData.setting ? {...node.setting, ...updatedData.setting} : node.setting 
            };
            return updated;
        }
        if (node.children?.length > 0)
            return { ...node, children: updatedNodeRecursive(node.children, nodeId, updatedData) };
        return node;
    });
};

export const useVariablesStore = create((set, get) => ({
    variables: [],
    selectedNode: [],

    setSelectedNode: (node) => {
        set({ selectedNode: node });
    },

    addNode: (parentId, newNode, index) => {
        if (parentId === null) {
            set((state) => {
                const newVariables = [...state.variables];
                newVariables.splice(index, 0, newNode);
                return { variables: newVariables };
            });
        } else {
            set((state) => ({
                variables: addNodeRecursive(state.variables, parentId, newNode, index),
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
