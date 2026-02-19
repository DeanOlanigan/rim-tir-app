import { patchStoreRaf, useNodeStore } from "../store/node-store";
import { useShallow } from "zustand/shallow";
import { isLineLikeType } from "../utils";
import { getLineRect } from "../canvas/services/shapeTransforms";

export function useNodesByIds(ids, param) {
    return useNodeStore(useShallow((s) => ids.map((id) => s.nodes[id][param])));
}

export function sameCheck(params) {
    if (!params.length) return null;
    const first = params[0];
    if (first == null) return null;
    return params.every((p) => p === first) ? first : null;
}

export function collectSelectionDimensions(api, ids, getType, widths, heights) {
    let width;
    let height;

    const same = (prev, next) => {
        if (prev === undefined) return next;
        return Math.abs(prev - next) < 0.5 ? prev : NaN;
    };

    ids.forEach((id, index) => {
        const type = getType(id);
        let w;
        let h;

        if (isLineLikeType(type)) {
            const rect = getLineRect(api, id);
            if (!rect) return;
            w = rect.width;
            h = rect.height;
        } else {
            w = widths[index];
            h = heights[index];
        }

        width = width === undefined ? w : same(width, w);
        height = height === undefined ? h : same(height, h);
    });

    return {
        width: width === undefined || Number.isNaN(width) ? "" : width,
        height: height === undefined || Number.isNaN(height) ? "" : height,
    };
}

export function applyPatch(ids, patch, undoable) {
    if (!patch) return;
    const keys = Object.keys(patch);
    if (keys.length === 0) return;

    if (undoable) {
        patchStoreRaf.flushNow?.();
        useNodeStore.getState().updateNodes(ids, patch);
    } else {
        patchStoreRaf(ids, patch);
    }
}

export function isFiniteValue(n) {
    return typeof n === "number" && Number.isFinite(n);
}
