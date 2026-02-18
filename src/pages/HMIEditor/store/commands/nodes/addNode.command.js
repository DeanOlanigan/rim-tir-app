import { nanoid } from "nanoid";
import { runCommand } from "../runCommand";
import { createDefaultNode } from "../../fabrics";

export const addNodeCommand = (api, node) => {
    runCommand(api, "cmd/nodes/addNode", (state) => {
        // page guard
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        // create node
        const id = nanoid(12);
        const newNode = {
            ...node,
            ...createDefaultNode(id),
        };

        // update page rootIds
        const newPage = {
            ...page,
            rootIds: [...page.rootIds, id],
        };

        // create command patch
        const patch = {
            nodes: { ...state.nodes, [id]: newNode },
            pages: { ...state.pages, [pageId]: newPage },
        };

        return {
            patch,
            dirty: true,
            tree: true,
            selection: "set",
            selectedIds: [id],
        };
    });
};
