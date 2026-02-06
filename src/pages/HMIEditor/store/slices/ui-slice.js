import { arraysEqual } from "@/utils/utils";
import { defaultPageId, defaultPages, defaultProjectName } from "../constants";

export const createUiSlice = (set) => ({
    selectedIds: [],

    setSelectedIds: (ids) =>
        set(
            (state) => {
                if (arraysEqual(state.selectedIds, ids)) return state;
                return { selectedIds: ids };
            },
            undefined,
            "ui/setSelectedIds",
        ),

    close: () =>
        set(
            () => ({
                projectName: defaultProjectName,
                nodes: {},
                pages: defaultPages,
                activePageId: defaultPageId,
                selectedIds: [],
                meta: { mode: "new", filename: "untitled", isDirty: false },
            }),
            undefined,
            "ui/close",
        ),

    open: (project, mode = "new", filename = "untitled") =>
        set(
            () => ({
                projectName: project.projectName,
                nodes: project.nodes,
                pages: project.pages,
                activePageId: project.activePageId,
                selectedIds: [],
                meta: { mode, filename, isDirty: false },
            }),
            undefined,
            "ui/open",
        ),
});
