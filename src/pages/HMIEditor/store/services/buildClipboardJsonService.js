import { collectSubtreeNodes, getTopLevelSelectedIds } from "../utils/nodes";

export function buildClipboardJsonService({ nodes, selectedIds }) {
    if (!selectedIds.length) return null;

    const rootIds = getTopLevelSelectedIds(nodes, selectedIds);
    const nodesSnapshot = collectSubtreeNodes(rootIds, nodes);

    const payload = {
        type: "rimtir/clipboard",
        version: 1,
        nodes: nodesSnapshot,
        rootIds,
    };

    return JSON.stringify(payload);
}
