import { arraysEqual } from "@/utils/utils";
import { reorderRootIds } from "../../utils/nodes";
import { runCommand } from "../runCommand";

export const reorderLayersCommand = (api, ids, dir) => {
    runCommand(api, "cmd/nodes/reorderLayers", (state) => {
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        const newRootIds = reorderRootIds(page.rootIds, ids, dir);
        if (arraysEqual(newRootIds, page.rootIds)) return null;

        const patch = {
            pages: {
                ...state.pages,
                [pageId]: {
                    ...page,
                    rootIds: newRootIds,
                },
            },
        };

        return {
            patch,
            dirty: true,
        };
    });
};
