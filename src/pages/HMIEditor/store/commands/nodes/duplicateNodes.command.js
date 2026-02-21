import { buildPayload } from "../../utils/clipboard";
import { buildInsertPatch } from "../clipboard/buildInsertPatch";
import { runCommand } from "../runCommand";

function computeWorldOffsetFromScreenPx({ screenPx, scale, gridSize }) {
    const rawWorld = screenPx / scale;

    // с сеткой: минимум 1 клетка и кратность gridSize
    const cells = Math.max(1, Math.ceil(rawWorld / gridSize));
    return cells * gridSize;
}

export const duplicateNodesCommand = (api, ids, opts = {}) => {
    const scale = opts.scale ?? 1;
    const gridSize = opts.gridSize ?? 1;

    const defaultWorldStep = computeWorldOffsetFromScreenPx({
        screenPx: 10,
        scale,
        gridSize,
    });

    const dx = opts.dx ?? defaultWorldStep;
    const dy = opts.dy ?? defaultWorldStep;

    runCommand(api, "cmd/nodes/duplicateNodes", (state) => {
        const pageId = state.activePageId;
        const page = state.pages[pageId];
        if (!page) return null;

        const payload = buildPayload({
            nodes: state.nodes,
            selectedIds: ids,
        });
        if (!payload) return null;

        const res = buildInsertPatch(
            state,
            payload,
            { kind: "offset", dx, dy, gridSize },
            {
                respectRootParent: true,
                insertStrategy: "after",
                recalcGroups: true,
            },
        );
        if (!res) return null;

        return {
            patch: res.patch,
            dirty: true,
            tree: true,
            selection: "set",
            selectedIds: res.insertedRootIds,
        };
    });
};
