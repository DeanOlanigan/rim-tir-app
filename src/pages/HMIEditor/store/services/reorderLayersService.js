import { arraysEqual } from "@/utils/utils";
import { reorderRootIds } from "../utils/nodes";

export function reorderLayersService(state, ids, dir) {
    const pageId = state.activePageId;
    const page = state.pages[pageId];
    if (!page) return state;

    const newRootIds = reorderRootIds(page.rootIds, ids, dir);
    if (arraysEqual(newRootIds, page.rootIds)) return state;

    return {
        pages: {
            ...state.pages,
            [pageId]: {
                ...page,
                rootIds: newRootIds,
            },
        },
    };
}
