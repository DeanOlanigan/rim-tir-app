import throttle from "throttleit";
import { useNodeStore } from "../store/node-store";

function patchStoreNode(id, patch) {
    useNodeStore.getState().updateNode(id, patch);
}

function patchStoreNodes(ids, patchesById) {
    useNodeStore.getState().updateNodes(ids, patchesById);
}

export const patchNodeThrottled = throttle(patchStoreNode, 20);
export const patchNodesThrottled = throttle(patchStoreNodes, 20);
