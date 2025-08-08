import { create } from "zustand";
import {
    addNodeUtil,
    removeNodeUtil,
    moveNodesUtil,
    renameNodeSettingUtil,
    createSettingUtil,
    removeSettingUtil,
    editSettingUtil,
    bindVariableUtil,
    unbindVariableUtil,
    moveSettingUtil,
    ignoreNodeUtil,
    copyTreeUtil,
    copySettingsUtil,
    getIdsSetNormalized,
    getIdsSetWithoutNested,
    generateNewIds,
    getParentId,
} from "@/utils/treeUtils";
import { devtools, persist } from "zustand/middleware";
import {
    validateAll,
    validateName,
    validateParameter,
} from "@/utils/validation/validator";
import { validateCyclicVariable } from "@/utils/validation/luaValidationService";
import { useValidationStore } from "@/store/validation-store";
import { CONSTANT_VALUES } from "@/config/constants";

const baseNodeInit = (type, name) => ({
    id: type,
    type: CONSTANT_VALUES.NODE_TYPES.root,
    path: "#",
    subType: type,
    name: name,
    children: [],
});

const initialState = {
    // Деревья для react-arborist
    send: [baseNodeInit(CONSTANT_VALUES.TREE_TYPES.send, "Передача")],
    receive: [baseNodeInit(CONSTANT_VALUES.TREE_TYPES.receive, "Прием")],
    variables: [
        baseNodeInit(CONSTANT_VALUES.TREE_TYPES.variables, "Переменные"),
    ],
    // Параметры всех узлов деревьев
    settings: {
        [CONSTANT_VALUES.TREE_TYPES.send]: baseNodeInit(
            CONSTANT_VALUES.TREE_TYPES.send,
            "Передача"
        ),
        [CONSTANT_VALUES.TREE_TYPES.receive]: baseNodeInit(
            CONSTANT_VALUES.TREE_TYPES.receive,
            "Прием"
        ),
        [CONSTANT_VALUES.TREE_TYPES.variables]: baseNodeInit(
            CONSTANT_VALUES.TREE_TYPES.variables,
            "Переменные"
        ),
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

                updateSelectedIds: (targetKey, ids) =>
                    set((state) => ({
                        selectedIds: {
                            ...state.selectedIds,
                            [targetKey]: ids,
                        },
                    })),

                createSetting: (settings) => {
                    set((state) => ({
                        settings: createSettingUtil(state.settings, settings),
                    }));
                    const state = get().settings;
                    validateAll(state);
                },

                setSettings: (nodeId, updateData) =>
                    set((state) => {
                        const newSettings = editSettingUtil(
                            state.settings,
                            nodeId,
                            updateData
                        );

                        const param = Object.keys(updateData)[0];
                        validateParameter(nodeId, param, newSettings);

                        return { settings: newSettings };
                    }),

                bindVariable: (nodeId, variableId) =>
                    set((state) => ({
                        settings: bindVariableUtil(
                            state.settings,
                            nodeId,
                            variableId
                        ),
                    })),

                unbindVariable: (nodeId) =>
                    set((state) => ({
                        settings: unbindVariableUtil(state.settings, nodeId),
                    })),

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

                renameNode: (nodeId, name) =>
                    set((state) => {
                        const newSettings = renameNodeSettingUtil(
                            state.settings,
                            nodeId,
                            name
                        );

                        if (
                            newSettings[nodeId].rootId ===
                            CONSTANT_VALUES.TREE_TYPES.variables
                        ) {
                            const variables = Object.values(newSettings).filter(
                                (node) => node.type === "variable"
                            );
                            validateCyclicVariable(variables);
                        }

                        validateName({
                            id: nodeId,
                            settings: newSettings,
                        });

                        return { settings: newSettings };
                    }),

                ignoreNode: (treeApi, ids, ignore) => {
                    const treeType = treeApi.props.treeType;
                    if (!ids.length) return;
                    set((state) => {
                        const newSettings = { ...state.settings };
                        for (const id of ids) {
                            newSettings[id].isIgnored = ignore;
                        }
                        return {
                            [treeType]: ignoreNodeUtil(
                                state[treeType],
                                ids,
                                ignore,
                                false,
                                "isIgnored"
                            ),
                            settings: newSettings,
                        };
                    });
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
                    const state = get().settings;
                    validateAll(state);
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
                    const state = get().settings;
                    validateAll(state);
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
                    const state = get().settings;
                    validateAll(state);
                },
            }),
            {
                name: "configuration-storage",
                onRehydrateStorage: () => (state) => {
                    const settings = state.settings || {};
                    validateAll(settings);
                },
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
