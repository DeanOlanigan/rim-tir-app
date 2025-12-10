import throttle from "throttleit";
import { useNodeStore } from "../store/node-store";
import { useShallow } from "zustand/shallow";
import debounce from "debounce";

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
