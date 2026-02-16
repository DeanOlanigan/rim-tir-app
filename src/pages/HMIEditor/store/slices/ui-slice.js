import { arraysEqual } from "@/utils/utils";

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
});
