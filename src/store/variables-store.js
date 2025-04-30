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
    copyTreeUtil,
    copySettingsUtil,
    getIdsSetNormalized,
    getIdsSetWithoutNested,
    generateNewIds,
    getParentId,
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
            copyBuffer: {
                type: "",
                tree: [],
                normalized: {},
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
                    copyBuffer: {
                        type: "",
                        tree: [],
                        normalized: {},
                    },
                }),

            setConfigInfo: (data) => set({ configInfo: data }),

            updateSelectedIds: (targetKey, ids) => {
                /* const { selectedIds } = get();
                const currentIds = selectedIds[targetKey]; */

                set((state) => ({
                    selectedIds: {
                        ...state.selectedIds,
                        [targetKey]: ids,
                    },
                }));
                /* if (!shallow(currentIds, ids)) {
                } */
            },

            createSetting: (settings) =>
                set((state) => ({
                    settings: createSettingUtil(state.settings, settings),
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

            addNode: (targetKey, parentId, newNodes) => {
                if (parentId === null) {
                    set((state) => {
                        const newTargetNode = [...state[targetKey]];
                        newTargetNode.splice(0, 0, ...newNodes);
                        return { [targetKey]: newTargetNode };
                    });
                } else {
                    set((state) => ({
                        [targetKey]: addNodeUtil(
                            state[targetKey],
                            parentId,
                            newNodes
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

            ignoreNode: (treeApi, ids, ignore) => {
                const treeType = treeApi.props.treeType;
                if (!ids.length) return;
                set((state) => ({
                    [treeType]: ignoreNodeUtil(state[treeType], ids, ignore),
                }));
            },

            copyNode: (treeApi, ids) => {
                const treeType = treeApi.props.treeType;
                const settings = get().settings;
                const idsSetNormalized = getIdsSetNormalized(treeApi, ids);
                const idsSetWithoutNested = getIdsSetWithoutNested(
                    treeApi,
                    ids
                );
                const copyTree = copyTreeUtil(treeApi, idsSetWithoutNested);
                const copySettings = copySettingsUtil(
                    settings,
                    idsSetNormalized
                );
                set(() => ({
                    copyBuffer: {
                        type: treeType,
                        tree: copyTree,
                        normalized: copySettings,
                    },
                }));
            },

            pasteNode: (treeApi) => {
                const parentId = getParentId(treeApi);
                const { type, tree, normalized } = get().copyBuffer;
                const { tree: newTree, settings: newSettings } = generateNewIds(
                    tree,
                    normalized,
                    parentId
                );
                const settings = Object.values(newSettings);
                get().addNode(type, parentId, newTree);
                get().createSetting(settings);
                set(() => ({
                    copyBuffer: {
                        type: "",
                        tree: [],
                        normalized: {},
                    },
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
