import {
    CLIPBOARD_TYPE,
    CLIPBOARD_TYPE_VERSION,
} from "@/pages/HMIEditor/constants";
import { collectSubtreeNodes, getTopLevelSelectedIds } from "../nodes";

export function buildPayload({ nodes, selectedIds }) {
    if (!selectedIds.length) return null;

    // корни копируемых поддеревьев
    const rootIds = getTopLevelSelectedIds(nodes, selectedIds);
    if (!rootIds.length) return null;

    const nodesSnapshot = collectSubtreeNodes(rootIds, nodes);

    const payload = {
        type: CLIPBOARD_TYPE,
        version: CLIPBOARD_TYPE_VERSION,
        nodes: nodesSnapshot,
        rootIds,
    };

    return payload;
}
