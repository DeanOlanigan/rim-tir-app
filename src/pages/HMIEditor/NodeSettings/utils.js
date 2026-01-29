import throttle from "throttleit";
import { useNodeStore } from "../store/node-store";
import { useShallow } from "zustand/shallow";
import debounce from "debounce";
import { isLineLikeType } from "../utils";
import { getLineRect } from "../canvas/services/shapeTransforms";

function patchStoreNode(id, patch) {
    useNodeStore.getState().updateNode(id, patch);
}

function patchStoreNodes(ids, patchesById) {
    useNodeStore.getState().updateNodes(ids, patchesById);
}

export const patchNodeThrottled = throttle(patchStoreNode, 20);
export const patchNodesThrottled = throttle(patchStoreNodes, 20);
export const patchNodeDebounced = debounce(patchStoreNode, 200);
export const patchNodesDebounced = debounce(patchStoreNodes, 200);

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
