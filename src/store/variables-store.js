import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NODE_TYPES, TREE_TYPES } from "@/config/constants";
import { useValidationStore } from "@/store/validation-store";
import { configuratorConfig } from "@/utils/configurationParser";
import {
    isNeedValidate,
    revalidateVars,
    validateParameter,
    validateName,
    validateAll,
    ErrorDraft,
    validateNode,
} from "@/utils/validation";
import {
    removeNodeUtil,
    removeAndUnbindSettingsUtil,
    bindVariableUtil,
    unbindVariableUtil,
    addNodeUtil,
    createSettingUtil,
    getIdsSetNormalizedContext,
    moveNodesUtil,
    moveSettingUtil,
    renameNodeSettingUtil,
    editSettingUtil,
    computeClipboard,
    pasteNodeUtil,
    setIgnoreUtil,
} from "@/utils/treeUtils";

const baseNodeInit = (type, name) => ({
    id: type,
    type: NODE_TYPES.root,
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

    clipboard: {
        type: "",
        normalized: {},
        roots: [],
        ids: new Set(),
        cut: false,
    },

    sync: false,

    info: {
        ts: null,
        name: null,
        description: null,
    },
};

export const useVariablesStore = create()(
    persist(
        (set, get) => ({
            ...initialState,

            resetState: () => set(initialState),

            setSync: (value) => set({ sync: value }),

            updateEditTs: () =>
                set({ info: { ...get().info, ts: Date.now() } }),

            updateInfo: (ts, name, description) =>
                set((state) => ({
                    info: {
                        ...state.info,
                        ts: ts ?? state.info.ts,
                        name: name ?? state.info.name,
                        description: description ?? state.info.description,
                    },
                })),

            updateSelectedIds: (targetKey, ids) =>
                set((state) => {
                    const prev = state.selectedIds[targetKey];
                    if (prev === ids) return state;
                    if (
                        prev.size === ids.size &&
                        [...prev].every((id) => ids.has(id))
                    )
                        return state;
                    return {
                        selectedIds: {
                            ...state.selectedIds,
                            [targetKey]: ids,
                        },
                    };
                }),

            createSetting: (settings) => {
                set((state) => ({
                    settings: createSettingUtil(state.settings, settings),
                }));

                const state = get().settings;
                const draft = validateAll(state, configuratorConfig);
                useValidationStore.getState().applyDraft2(draft);
            },

            setSettings: (nodeId, updateData) =>
                set((state) => {
                    const newSettings = editSettingUtil(
                        state.settings,
                        nodeId,
                        updateData
                    );

                    let draft = new ErrorDraft();
                    const params = Object.keys(updateData);
                    for (const param of params) {
                        if (param === "luaExpression") {
                            revalidateVars(newSettings, draft);
                        } else {
                            validateParameter({
                                id: nodeId,
                                param,
                                settings: newSettings,
                                cfg: configuratorConfig,
                                draft,
                            });
                        }
                    }
                    useValidationStore.getState().applyDraft2(draft);

                    return { settings: newSettings };
                }),

            bindVariable: (nodeId, variableId) =>
                set((state) => {
                    let newSettings = unbindVariableUtil(
                        state.settings,
                        nodeId
                    );
                    if (variableId) {
                        newSettings = bindVariableUtil(
                            newSettings,
                            nodeId,
                            variableId
                        );
                    }

                    const draft = validateParameter({
                        id: nodeId,
                        param: "variableId",
                        settings: newSettings,
                        cfg: configuratorConfig,
                    });
                    useValidationStore.getState().applyDraft2(draft);

                    return { settings: newSettings };
                }),

            addNode: (treeType, parentId, newNodes) =>
                set((state) => ({
                    [treeType]: addNodeUtil(
                        state[treeType],
                        parentId,
                        newNodes
                    ),
                })),

            renameNode: (nodeId, name) =>
                set((state) => {
                    if (state.settings[nodeId].name === name) return state;
                    const newSettings = renameNodeSettingUtil(
                        state.settings,
                        nodeId,
                        name
                    );

                    const nodeType = newSettings[nodeId].type;
                    const isVariables = nodeType === NODE_TYPES.variable;
                    const isNeedVal = isNeedValidate(nodeType);
                    const draft = new ErrorDraft();

                    if (isVariables) {
                        revalidateVars(newSettings, draft);
                    }

                    if (isNeedVal) {
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

            setIgnore: (ids, value) =>
                set((state) => {
                    const newSettings = setIgnoreUtil(
                        state.settings,
                        ids,
                        value
                    );
                    const idsSet = getIdsSetNormalizedContext(newSettings, ids);

                    let draft = new ErrorDraft();
                    for (const id of idsSet) {
                        const node = newSettings[id];
                        validateNode({
                            node,
                            settings: newSettings,
                            configuratorConfig,
                            draft,
                        });
                        if (newSettings[id].type === NODE_TYPES.variable) {
                            revalidateVars(newSettings, draft);
                        }
                    }
                    useValidationStore.getState().applyDraft2(draft);

                    return { settings: newSettings };
                }),

            toggleIgnore: (ids) => {
                const { settings } = get();
                const allIgnored = ids.every(
                    (id) => settings[id]?.isIgnored === true
                );
                get().setIgnore(ids, !allIgnored);
            },

            copyNode: (treeType, ids) =>
                set((state) => {
                    const payload = computeClipboard(
                        treeType,
                        state.settings,
                        ids,
                        false
                    );
                    if (!payload) return state;
                    return { clipboard: payload };
                }),

            pasteNode: (treeType, parentId) => {
                set((state) =>
                    pasteNodeUtil(
                        state,
                        treeType,
                        parentId,
                        initialState.clipboard
                    )
                );

                const state = get().settings;
                const draft = validateAll(state, configuratorConfig);
                useValidationStore.getState().applyDraft2(draft);
            },

            cutNode: (treeType, ids) =>
                set((state) => {
                    const payload = computeClipboard(
                        treeType,
                        state.settings,
                        ids,
                        true
                    );
                    if (!payload) return state;
                    return { clipboard: payload };
                }),

            removeNode: (targetKey, nodeIds) => {
                const { settings } = get();
                const idsSet = getIdsSetNormalizedContext(settings, nodeIds);
                useValidationStore.getState().clearErrors(idsSet);

                set((state) => ({
                    [targetKey]: removeNodeUtil(state[targetKey], idsSet),
                    settings: removeAndUnbindSettingsUtil(
                        state.settings,
                        idsSet
                    ),
                }));

                // TODO Реализовать более точечную валидацию
                const state = get().settings;
                const draft = validateAll(state, configuratorConfig);
                useValidationStore.getState().applyDraft2(draft);
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
                const draft = validateAll(state, configuratorConfig);
                useValidationStore.getState().applyDraft2(draft);
            },
        }),
        {
            name: "configuration-storage",
            skipHydration: true,
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(
                        ([key]) => !["selectedIds", "clipboard"].includes(key)
                    )
                ),
        }
    )
);

export const rehydrateSettings = () => useVariablesStore.persist.rehydrate();
