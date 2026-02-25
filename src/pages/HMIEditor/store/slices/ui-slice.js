import { arraysEqual } from "@/utils/utils";
import { useNodeStore } from "../node-store";
import { buildBaselineById } from "../utils/interactiveSnapshot";

// потенциальный кандидат на удаление, а selectedIds перенесется в actionsStore
export const createUiSlice = (api) => ({
    selectedIds: [],

    setSelectedIds: (ids) =>
        api.set(
            (state) => {
                if (arraysEqual(state.selectedIds, ids)) return state;
                return { selectedIds: ids };
            },
            undefined,
            "ui/setSelectedIds",
        ),

    undo: () => {
        const temporal = useNodeStore.temporal.getState();
        temporal.undo();
        // Если индексы исключены из history и это кэш:
        // api.get().rebuildIndexes?.();
    },
    redo: () => {
        const temporal = useNodeStore.temporal.getState();
        temporal.redo();
        // api.get().rebuildIndexes?.();
    },
    clearHistory: () => {
        const temporal = useNodeStore.temporal.getState();
        temporal.clear();
    },

    interactiveSnapshot: null,

    beginInteractiveSnapshot: (ids, property) => {
        const state = api.get();
        const baselineById = buildBaselineById(
            state.nodes,
            ids || [],
            property,
        );
        api.set(
            (s) => ({
                ...s,
                interactiveSnapshot: {
                    ids: [...(ids || [])],
                    baselineById,
                },
            }),
            false,
            "ui/beginInteractiveSnapshot",
        );
    },

    clearInteractiveSnapshot: () => {
        api.set(
            (s) =>
                s.interactiveSnapshot ? { ...s, interactiveSnapshot: null } : s,
            false,
            "ui/clearInteractiveSnapshot",
        );
    },
});
