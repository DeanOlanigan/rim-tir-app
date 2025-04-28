import { create } from "zustand";
import { getUniqueName, separateDataNEW, separateTree } from "../utils/utils";
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
    editSettingNodeUtil,
    bindVariableUtil,
    unbindVariableUtil,
    moveSettingUtil,
    bindVariableToNodeUtil,
    ignoreNodeUtil,
} from "../utils/treeUtils";
import { shallow } from "zustand/shallow";
import { persist } from "zustand/middleware";

const { treeData, nodeData } = separateDataNEW(config);
const { trees, configurationInfo } = separateTree(treeData);
console.log(nodeData, trees);

export const useVariablesStore = create()(
    persist(
        (set, get) => ({
            // Базовая информация о конфигурации
            configInfo: {},
            // Деревья для react-arborist
            send: [],
            receive: [],
            variables: [],
            // Параметры всех узлов деревьев
            settings: {},
            // Id выбранных узлов
            selectedIds: {
                connections: new Set(),
                variables: new Set(),
            },

            resetState: () =>
                set({
                    configInfo: {},
                    send: [],
                    receive: [],
                    variables: [],
                    settings: {},
                    selectedIds: {
                        connections: new Set(),
                        variables: new Set(),
                    },
                }),

            setConfigInfo: (data) => set({ configInfo: data }),

            updateSelectedIds: (targetKey, ids) => {
                const { selectedIds } = get();
                const currentIds = selectedIds[targetKey];

                if (!shallow(currentIds, ids)) {
                    set((state) => ({
                        selectedIds: {
                            ...state.selectedIds,
                            [targetKey]: ids,
                        },
                    }));
                }
            },

            createSetting: (nodeId, setting) =>
                set((state) => ({
                    settings: createSettingUtil(
                        state.settings,
                        nodeId,
                        setting
                    ),
                })),

            setSettings: (nodeId, updateData) =>
                set((state) => ({
                    settings: editSettingUtil(
                        state.settings,
                        nodeId,
                        updateData
                    ),
                })),

            setSettingsNode: (nodeId, updateData) =>
                set((state) => ({
                    settings: editSettingNodeUtil(
                        state.settings,
                        nodeId,
                        updateData
                    ),
                })),

            bindVariable: (nodeId, variableId) => {
                set((state) => {
                    const { receive, send } = bindVariableToNodeUtil(
                        state.receive,
                        state.send,
                        nodeId,
                        variableId
                    );
                    return {
                        settings: bindVariableUtil(
                            state.settings,
                            nodeId,
                            variableId
                        ),
                        receive,
                        send,
                    };
                });
            },

            unbindVariable: (nodeId) =>
                set((state) => {
                    const { receive, send } = bindVariableToNodeUtil(
                        state.receive,
                        state.send,
                        nodeId,
                        null
                    );
                    return {
                        settings: unbindVariableUtil(state.settings, nodeId),
                        receive,
                        send,
                    };
                }),

            addNode: (targetKey, parentId, newNode) => {
                if (parentId === null) {
                    set((state) => {
                        const newTargetNode = [...state[targetKey]];
                        newTargetNode.splice(0, 0, newNode);
                        return { [targetKey]: newTargetNode };
                    });
                } else {
                    set((state) => ({
                        [targetKey]: addNodeUtil(
                            state[targetKey],
                            parentId,
                            newNode
                        ),
                    }));
                }
            },

            renameNode: (targetKey, nodeId, name) => {
                set((state) => {
                    const uniqueName = getUniqueName(
                        state[targetKey],
                        name,
                        nodeId
                    );
                    return {
                        [targetKey]: renameNodeUtil(
                            state[targetKey],
                            nodeId,
                            uniqueName
                        ),
                        settings: renameNodeSettingUtil(
                            state.settings,
                            nodeId,
                            uniqueName
                        ),
                    };
                });
            },

            ignoreNode: (treeApi) => {
                const treeType = treeApi.props.treeType;
                const ids =
                    treeApi.selectedIds.size > 1
                        ? [...treeApi.selectedIds]
                        : treeApi.focusedNode
                        ? [treeApi.focusedNode.data.id]
                        : [];
                if (!ids.length) return;
                const nodesToIgnore = ids.map((id) => {
                    const node = treeApi.get(id) || treeApi.focusedNode;
                    return {
                        id: node.data.id,
                        isIgnored: node.data.isIgnored,
                    };
                });
                console.log(nodesToIgnore);
                set((state) => ({
                    [treeType]: ignoreNodeUtil(state[treeType], nodesToIgnore),
                }));
            },

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
                    settings: moveSettingUtil(
                        state.settings,
                        dragIds,
                        parentId,
                        index
                    ),
                })),
        }),
        {
            name: "configuration-storage",
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(
                        ([key]) => !["selectedIds"].includes(key)
                    )
                ),
        }
    )
);
