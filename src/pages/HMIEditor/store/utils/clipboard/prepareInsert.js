import { calcGroupAABBCenter } from "@/pages/HMIEditor/utils";
import { placeNodesAtPoint } from "./placeNodesAtPoint";
import { rehydrateClipboardNodes } from "./rehydrateClipboardNodes";

function isValidPayload(payload) {
    return !!(payload?.nodes && payload?.rootIds?.length);
}

function mapNewRootIds(oldRootIds, idMap) {
    return oldRootIds.map((id) => idMap[id]).filter(Boolean);
}

function normalizeInsertedRootParents({
    payload,
    newNodes,
    idMap,
    keepRootParent,
}) {
    const oldRootIds = payload.rootIds;

    for (let i = 0; i < oldRootIds.length; i++) {
        const oldRid = oldRootIds[i];
        const newRid = idMap[oldRid];
        if (!newRid) continue;

        const next = newNodes[newRid];
        if (!next) continue;

        const targetPid = keepRootParent
            ? (payload.nodes[oldRid]?.parentId ?? null)
            : null;
        if ((next.parentId ?? null) === targetPid) continue;

        newNodes[newRid] = { ...next, parentId: targetPid };
    }
}

function applyPlacementToRoots({ nodes, rootIds, placement }) {
    const gridSize = placement?.gridSize ?? 1;

    if (placement?.kind === "point") {
        placeNodesAtPoint({
            nodes,
            rootIds,
            x: placement.x,
            y: placement.y,
            gridSize,
        });
        return;
    }

    if (placement?.kind !== "offset") return;

    const rootNodes = rootIds.map((id) => nodes[id]).filter(Boolean);
    if (!rootNodes.length) return;

    const pivot = calcGroupAABBCenter(rootNodes);

    placeNodesAtPoint({
        nodes,
        rootIds,
        x: pivot.x + (placement.dx ?? 0),
        y: pivot.y + (placement.dy ?? 0),
        gridSize,
    });
}

/**
 *
 * @param {*} payload { type, version, nodes, rootIds }
 * @param {*} placement { kind: "point", x, y, gridSize } | { kind: "offset", dx, dy, gridSize }
 * @param {*} opts { keepRootParent?: boolean }
 * @returns {object} { newNodes, newRootIds }
 */
export function prepareInsertFromPayload(payload, placement, opts = {}) {
    if (!isValidPayload(payload)) return null;

    const { newNodes, idMap } = rehydrateClipboardNodes(payload.nodes);
    const rootIdsToInsert = mapNewRootIds(payload.rootIds, idMap);
    if (!rootIdsToInsert.length) return null;

    normalizeInsertedRootParents({
        payload,
        newNodes,
        idMap,
        keepRootParent: !!opts.keepRootParent,
    });

    applyPlacementToRoots({
        nodes: newNodes,
        rootIds: rootIdsToInsert,
        placement,
    });

    return { nodesToInsert: newNodes, rootIdsToInsert: rootIdsToInsert, idMap };
}
