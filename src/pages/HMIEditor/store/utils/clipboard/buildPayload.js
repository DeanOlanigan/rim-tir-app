import {
    CLIPBOARD_TYPE,
    CLIPBOARD_TYPE_VERSION,
} from "@/pages/HMIEditor/constants";
import { collectSubtreeNodes, getTopLevelSelectedIds } from "../nodes";

export function buildPayload({ nodes, selectedIds, pageRootIds }) {
    if (!selectedIds.length) return null;

    const top = getTopLevelSelectedIds(nodes, selectedIds);
    const topSet = new Set(top);
    const rootIds =
        Array.isArray(pageRootIds) && pageRootIds.length
            ? pageRootIds.filter((id) => topSet.has(id))
            : top;

    const nodesSnapshot = collectSubtreeNodes(rootIds, nodes);

    const payload = {
        type: CLIPBOARD_TYPE,
        version: CLIPBOARD_TYPE_VERSION,
        nodes: nodesSnapshot,
        rootIds,
    };

    return { payload, rootIds };
}
