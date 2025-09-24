import { create } from "zustand";
import { persist } from "zustand/middleware";
import { configuratorConfig } from "@/utils/configurationParser";
import { useValidationStore } from "@/store/validation-store";
import { validateCyclicVariable } from "@/utils/validation";
import { validateParameter } from "@/utils/validation";
import { validateName } from "@/utils/validation";
import { validateAll } from "@/utils/validation";
import { ErrorDraft } from "@/utils/validation";
import { NODE_TYPES, NODE_UNIQUE_NAMES, TREE_TYPES } from "@/config/constants";
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
} from "@/utils/treeUtils/index";

import { setIgnoreUtil } from "@/utils/treeUtils/edit/setIgnore";

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
};

export const useVariablesStore = create()(
    persist(
        (set, get) => ({
            ...initialState,

            resetState: () => set(initialState),

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
                            newSettings,
                            configuratorConfig
                        );
                        useValidationStore.getState().applyDraft2(draft);
                    }

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

                    const draft = validateParameter(
                        nodeId,
                        "variableId",
                        newSettings,
                        configuratorConfig
                    );
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

                    const isVariables =
                        newSettings[nodeId].type === NODE_TYPES.variable;
                    const isNeedValidate = NODE_UNIQUE_NAMES.has(
                        newSettings[nodeId].type
                    );
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

            setIgnore: (ids, value) =>
                set((state) => ({
                    settings: setIgnoreUtil(state.settings, ids, value),
                })),

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
