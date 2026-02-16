import { useNodeStore } from "../store/node-store";
import { useShallow } from "zustand/shallow";
import { isLineLikeType } from "../utils";
import { getLineRect } from "../canvas/services/shapeTransforms";

export function useNodesByIds(ids, param) {
    return useNodeStore(useShallow((s) => ids.map((id) => s.nodes[id][param])));
}

export function sameCheck(params) {
    const first = params[0];
    return params.every((p) => p === first) ? first : "";
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
