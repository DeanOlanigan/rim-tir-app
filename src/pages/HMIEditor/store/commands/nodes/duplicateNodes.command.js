import { buildPayload } from "../../utils/clipboard";
import { buildInsertPatch } from "../clipboard/buildInsertPatch";
import { runCommand } from "../runCommand";

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
