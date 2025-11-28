import throttle from "throttleit";
import { useNodeStore } from "../store/node-store";

function patchStoreNode(id, patch) {
    useNodeStore.getState().updateNode(id, patch);
}

export const patchNodeThrottled = throttle(patchStoreNode, 200);
