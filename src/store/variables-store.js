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
import { persist } from "zustand/middleware";
import { validateParameter } from "@/utils/validation/validator";
import { validateCyclicVariable } from "@/utils/validation/luaValidationService/luaValidationService";
import { useValidationStore } from "@/store/validation-store";
import { CONSTANT_VALUES } from "@/config/constants";
import { validateName } from "@/utils/validation/nameValidation";
import { ErrorDraft } from "@/utils/validation/ErrorDraft";
import { validateAll } from "@/utils/validation/validation";
import { NODE_TYPES, TREE_TYPES } from "@/config/constants";

const baseNodeInit = (type, name) => ({
    id: type,
    type: CONSTANT_VALUES.NODE_TYPES.root,
    path: "#",
    name: name,
    children: [],
});

const initialState = {
    // Деревья для react-arborist
    send: [baseNodeInit(TREE_TYPES.send, "Передача")],
    receive: [baseNodeInit(TREE_TYPES.receive, "Прием")],
    variables: [baseNodeInit(TREE_TYPES.variables, "Переменные")],
    // Параметры всех узлов деревьев
    settings: {
        [TREE_TYPES.send]: baseNodeInit(TREE_TYPES.send, "Передача"),
        [TREE_TYPES.receive]: baseNodeInit(TREE_TYPES.receive, "Прием"),
        [TREE_TYPES.variables]: baseNodeInit(
            TREE_TYPES.variables,
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

            setSettings: (nodeId, updateData, shoudValidate = true) =>
                set((state) => {
                    const newSettings = editSettingUtil(
                        state.settings,
                        nodeId,
                        updateData
                    );

                    if (shoudValidate) {
                        const param = Object.keys(updateData)[0];
                        const draft = validateParameter(
                            nodeId,
                            param,
                            newSettings
                        );
                        console.log("Черновик:", draft);
                        useValidationStore.getState().applyDraft2(draft);
                    }

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
                    const isVariables =
                        newSettings[nodeId].type === NODE_TYPES.variable;
                    const isNeedValidate = [
                        NODE_TYPES.protocol,
                        NODE_TYPES.variable,
                        NODE_TYPES.interface,
                    ].includes(newSettings[nodeId].type);
                    const draft = new ErrorDraft();
                    if (isVariables) {
                        const variables = Object.values(newSettings).filter(
                            (node) => node.type === NODE_TYPES.variable
                        );
                        validateCyclicVariable({ variables, draft });
                    }

                    if (isNeedValidate) {
                        validateName({
                            id: nodeId,
                            settings: newSettings,
                            draft,
                        });
                    }

                    if (isVariables || isNeedValidate) {
                        useValidationStore.getState().applyDraft2(draft);
                    }

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
                const { tree: newTree, settings: newSettings } = generateNewIds(
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
                        [targetKey]: removeNodeUtil(state[targetKey], nodeIds),
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
);
