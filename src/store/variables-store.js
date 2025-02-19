import { create } from "zustand";
import { variable } from "../config/testData";

// Вспомогательная функция для рекурсивного поиска и удаления узла по id.
// Функция возвращает объект с обновлённым деревом (nodes) и извлечённым узлом (node).
function extractNode(nodes, nodeId) {
    let extracted = null;
    
    // Рекурсивная функция, которая обходит узлы и удаляет найденный узел
    const recursive = (items) => {
        return items.reduce((acc, node) => {
            if (node.id === nodeId) {
                // Если найден нужный узел, запоминаем его и не включаем в результирующий массив
                extracted = node;
                return acc;
            }
            // Если есть дочерние узлы – рекурсивно ищем в них
            if (node.children) {
                node = { ...node, children: recursive(node.children) };
            }
            return [...acc, node];
        }, []);
    };
    
    const newNodes = recursive(nodes);
    return { nodes: newNodes, node: extracted };
}
  
// Вспомогательная функция для рекурсивного поиска родительского узла по parentId
// и вставки новых узлов (nodesToInsert) в его массив children по указанному индексу.
function insertNodes(nodes, parentId, nodesToInsert, index) {
    return nodes.map(node => {
        if (node.id === parentId) {
            // Находим массив дочерних узлов (если его нет – создаём)
            const children = node.children ? [...node.children] : [];
            // Вставляем новые узлы по заданному индексу
            children.splice(index, 0, ...nodesToInsert);
            return { ...node, children };
        }
        // Если узел имеет дочерние элементы – продолжаем поиск
        if (node.children) {
            return { ...node, children: insertNodes(node.children, parentId, nodesToInsert, index) };
        }
        return node;
    });
}

const addNodeRecursive = (nodes, parentId, newNode, index) => {
    return nodes.map((node) => {
        if (node.id === parentId) {
            /* const newVariables = [...node.children];
            newVariables.splice(index, 0, newNode);
            return { ...node, children: newVariables }; */
            return { ...node, children: [...node.children, newNode] };
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

const removeNodeRecursive = (nodes, nodeId) => {
    const result = nodes
        .filter((node) => !nodeId.includes(node.id))
        .map((node) => ({
            ...node,
            children: node.children ? removeNodeRecursive(node.children, nodeId) : undefined,
        }));
    return result;
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
                /* const newVariables = [...state.variables];
                newVariables.splice(index, 0, newNode);
                return { variables: newVariables }; */
                return { variables: [...state.variables, newNode] };
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
            variables: removeNodeRecursive(state.variables, nodeId),
            selectedNode: []
        }));
    },

    moveNode: (dragIds, parentId, index) => {
        set((state) => {
            
            let updatedVariables = [...state.variables];
            const draggedNodes = [];

            dragIds.forEach(dragId => {
                const { nodes, node } = extractNode(updatedVariables, dragId);
                updatedVariables = nodes;
                if (node) {
                    draggedNodes.push(node);
                }
            });

            if (parentId === null) {
                updatedVariables.splice(index, 0, ...draggedNodes);
            } else {
                updatedVariables = insertNodes(updatedVariables, parentId, draggedNodes, index);
            }

            return { variables: updatedVariables };
        });
    }

}));
