import { buildIndexesFromNodes } from "../../utils/bindings";
import { buildPayload } from "../../utils/clipboard";
import { duplicateSubtrees } from "../../utils/nodes";
import { buildInsertPatch } from "../clipboard/buildInsertPatch";
import { runCommand } from "../runCommand";

export const duplicateNodesCommandOLD = (api, ids) => {
    runCommand(api, "cmd/nodes/duplicateNodes", (state) => {
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        const { nodes, rootIds, selectedIds } = duplicateSubtrees(
            state.nodes,
            ids,
        );

        const updatedPage = {
            ...page,
            rootIds: [...page.rootIds, ...rootIds],
        };

        const { nodeIndex, varIndex } = buildIndexesFromNodes(nodes);

        const patch = {
            nodes,
            pages: {
                ...state.pages,
                [pageId]: updatedPage,
            },
            varIndex,
            nodeIndex,
        };

        return {
            patch,
            dirty: true,
            selection: "set",
            selectedIds,
        };
    });
};

export const duplicateNodesCommand = (api, ids, opts = {}) => {
    const gridSize = opts.gridSize ?? 1;
    const step = gridSize > 1 ? gridSize : 10;
    const dx = opts.dx ?? step;
    const dy = opts.dy ?? step;

    runCommand(api, "cmd/nodes/duplicateNodes", (state) => {
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        const build = buildPayload({
            nodes: state.nodes,
            selectedIds: ids,
            pageRootIds: page.rootIds,
        });
        if (!build.payload) return null;

        const res = buildInsertPatch(state, build.payload, {
            kind: "offset",
            dx,
            dy,
            gridSize,
        });
        if (!res) return null;

        return {
            patch: res.patch,
            dirty: true,
            selection: "set",
            selectedIds: res.insertedRootIds,
        };
    });
};
