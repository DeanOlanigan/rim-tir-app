import { arraysEqual } from "@/utils/utils";
import { useNodeStore } from "../node-store";
import {
    beginInteractiveSnapshotCommand,
    commitInteractiveSnapshotCommand,
} from "../commands";

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

    beginInteractiveSnapshot: () => beginInteractiveSnapshotCommand(api),
    commitInteractiveSnapshot: () => commitInteractiveSnapshotCommand(),
});
