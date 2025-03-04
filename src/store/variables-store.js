import { create } from "zustand";
import { separateDataNEW, separateTree } from "../utils/utils";
import { config } from "../config/testData";
import {
    addNodeUtil,
    removeNodeUtil,
    moveNodesUtil,
    renameNodeUtil,
    renameNodeSettingUtil,
    createSettingUtil,
    removeSettingUtil,
    editSettingUtil,
    moveSettingUtil,
} from "../utils/treeUtils";

const { treeData, nodeData } = separateDataNEW(config);
const { /* trees, */ configurationInfo } = separateTree(treeData);
console.log(nodeData);

export const useVariablesStore = create((set) => ({
    // Базовая информация о конфигурации
    configInfo: configurationInfo,
    // Деревья для react-arborist
    send: [],
    receive: [],
    variables: [],
    // Параметры всех узлов деревьев
    settings: [],
    // Id выбранных узлов
    selectedIds: {
        send: new Set(),
        receive: new Set(),
        variables: new Set(),
    },
    setSelectedIds: (targetKey, ids) =>
        set((state) => ({
            selectedIds: {
                ...state.selectedIds,
                [targetKey]: ids,
            },
        })),

    createSetting: (nodeId, setting) =>
        set((state) => ({
            settings: createSettingUtil(state.settings, nodeId, setting),
        })),

    setSettings: (nodeId, updateData) =>
        set((state) => ({
            settings: editSettingUtil(state.settings, nodeId, updateData),
        })),

    addNode: (targetKey, parentId, newNode) => {
        if (parentId === null) {
            set((state) => {
                const newTargetNode = [...state[targetKey]];
                newTargetNode.splice(0, 0, newNode);
                return { [targetKey]: newTargetNode };
            });
        } else {
            set((state) => ({
                [targetKey]: addNodeUtil(state[targetKey], parentId, newNode),
            }));
        }
    },

    renameNode: (targetKey, nodeId, name) =>
        set((state) => ({
            [targetKey]: renameNodeUtil(state[targetKey], nodeId, name),
            settings: renameNodeSettingUtil(state.settings, nodeId, name),
        })),

    removeNode: (targetKey, nodeIds) =>
        set((state) => ({
            [targetKey]: removeNodeUtil(state[targetKey], nodeIds),
            settings: removeSettingUtil(state.settings, nodeIds),
        })),

    moveNode: (targetKey, dragIds, parentId, index) =>
        set((state) => ({
            [targetKey]: moveNodesUtil(
                state[targetKey],
                dragIds,
                parentId,
                index
            ),
            settings: moveSettingUtil(state.settings, dragIds, parentId),
        })),
}));
