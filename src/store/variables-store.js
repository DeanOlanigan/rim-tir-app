import { create } from "zustand";
import { getUniqueName } from "@/utils/utils";
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
} from "@/utils/treeUtils";
import { devtools, persist } from "zustand/middleware";
import { validateAll, validateParameter } from "@/utils/validator";
import { useValidationStore } from "@/store/validation-store";
import { CONSTANT_VALUES } from "@/config/constants";

const initialState = {
    // Деревья для react-arborist
    send: [
        {
            id: CONSTANT_VALUES.TREE_TYPES.send,
            type: CONSTANT_VALUES.NODE_TYPES.root,
            subType: CONSTANT_VALUES.TREE_TYPES.send,
            name: "Передача",
            children: [],
        },
    ],
    receive: [
        {
            id: CONSTANT_VALUES.TREE_TYPES.receive,
            type: CONSTANT_VALUES.NODE_TYPES.root,
            subType: CONSTANT_VALUES.TREE_TYPES.receive,
            name: "Прием",
            children: [],
        },
    ],
    variables: [
        {
            id: CONSTANT_VALUES.TREE_TYPES.variables,
            type: CONSTANT_VALUES.NODE_TYPES.root,
            subType: CONSTANT_VALUES.TREE_TYPES.variables,
            name: "Переменные",
            children: [],
        },
    ],
    // Параметры всех узлов деревьев
    settings: {
        [CONSTANT_VALUES.TREE_TYPES.send]: {
            id: CONSTANT_VALUES.TREE_TYPES.send,
            type: CONSTANT_VALUES.NODE_TYPES.root,
            subType: CONSTANT_VALUES.TREE_TYPES.variables,
            name: "Передача",
            children: [],
        },
        [CONSTANT_VALUES.TREE_TYPES.receive]: {
            id: CONSTANT_VALUES.TREE_TYPES.receive,
            type: CONSTANT_VALUES.NODE_TYPES.root,
            subType: CONSTANT_VALUES.TREE_TYPES.variables,
            name: "Прием",
            children: [],
        },
        [CONSTANT_VALUES.TREE_TYPES.variables]: {
            id: CONSTANT_VALUES.TREE_TYPES.variables,
            type: CONSTANT_VALUES.NODE_TYPES.root,
            subType: CONSTANT_VALUES.TREE_TYPES.variables,
            name: "Переменные",
            children: [],
        },
    },
    // Id выбранных узлов
    selectedIds: {
        connections: new Set(),
        variables: new Set(),
    },
    copyBuffer: {
        type: "",
        tree: [],
        normalized: {},
        cut: false,
    },
};

export const useVariablesStore = create()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                resetState: () => set(initialState),

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

                createSetting: (settings) => {
                    set((state) => ({
                        settings: createSettingUtil(state.settings, settings),
                    }));
                    validateAll();
                },

                setSettings: (nodeId, updateData) =>
                    set((state) => {
                        const newSettings = editSettingUtil(
                            state.settings,
                            nodeId,
                            updateData
                        );

                        const param = Object.keys(updateData)[0];
                        const errors = validateParameter(
                            nodeId,
                            param,
                            newSettings
                        );
                        useValidationStore.getState().setBulkErrors(errors);

                        return { settings: newSettings };
                    }),

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
                            settings: unbindVariableUtil(
                                state.settings,
                                nodeId
                            ),
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

                renameNodeSetting: (nodeId, name) => {
                    set((state) => {
                        return {
                            settings: renameNodeSettingUtil(
                                state.settings,
                                nodeId,
                                name
                            ),
                        };
                    });
                },

                ignoreNode: (treeApi, ids, ignore) => {
                    const treeType = treeApi.props.treeType;
                    if (!ids.length) return;
                    set((state) => ({
                        [treeType]: ignoreNodeUtil(
                            state[treeType],
                            ids,
                            ignore,
                            false,
                            "isIgnored"
                        ),
                    }));
                },

                copyNode: (treeApi, ids, isCut = false) => {
                    const treeType = treeApi.props.treeType;
                    const settings = get().settings;
                    const idsSetNormalized = getIdsSetNormalized(treeApi, ids);
                    const idsSetWithoutNested = getIdsSetWithoutNested(
                        treeApi,
                        ids
                    );
                    const copyTree = copyTreeUtil(
                        treeApi,
                        idsSetWithoutNested,
                        isCut
                    );
                    const copySettings = copySettingsUtil(
                        settings,
                        idsSetNormalized,
                        isCut
                    );
                    set(() => ({
                        copyBuffer: {
                            type: treeType,
                            tree: copyTree,
                            normalized: copySettings,
                            cut: isCut,
                        },
                    }));
                },

                cutNode: (treeApi, ids, cut) => {
                    const treeType = treeApi.props.treeType;
                    if (!ids.length) return;
                    set((state) => ({
                        [treeType]: ignoreNodeUtil(
                            state[treeType],
                            ids,
                            cut,
                            false,
                            "isCutted"
                        ),
                    }));
                    console.log("cut");
                },

                pasteNode: (treeApi) => {
                    const stateSettings = get().settings;
                    const parentId = getParentId(treeApi);
                    const { type, tree, normalized } = get().copyBuffer;
                    const { tree: newTree, settings: newSettings } =
                        generateNewIds(
                            tree,
                            normalized,
                            parentId,
                            stateSettings
                        );
                    const settings = Object.values(newSettings);
                    get().addNode(type, parentId, newTree);
                    get().createSetting(settings);
                    set(() => ({
                        copyBuffer: {
                            type: "",
                            tree: [],
                            normalized: {},
                            cut: false,
                        },
                    }));
                    // TODO Реализовать более точечную валидацию
                    validateAll();
                },

                removeNode: (targetKey, nodeIds) => {
                    set((state) => {
                        useValidationStore.getState().clearErrors(nodeIds);
                        const newSettings = removeSettingUtil(
                            state.settings,
                            nodeIds
                        );
                        // TODO Реализовать более точечную валидацию
                        return {
                            [targetKey]: removeNodeUtil(
                                state[targetKey],
                                nodeIds
                            ),
                            settings: newSettings,
                        };
                    });
                    validateAll();
                },

                moveNode: (targetKey, dragIds, parentId, index) => {
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
                    }));
                    // TODO Реализовать более точечную валидацию
                    validateAll();
                },
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
    )
);
