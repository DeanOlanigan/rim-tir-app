import { isGroupType, round4 } from "@/pages/HMIEditor/utils";
import {
    calcAlignWorldDelta,
    getTopLevelSelectedIds,
    worldDeltaToParentLocalDelta,
} from "../../utils/nodes";
import {
    calculateContentBounds,
    getNodeLocalBounds,
    getNodeParentLocalAABB,
    getNodeWorldAABB,
    toAABBFromMinMax,
} from "../../utils/geometry";
import { runCommand } from "../runCommand";

function buildGroupChildrenAlignContext(state, ids) {
    if (ids.length !== 1) return null;

    const groupId = ids[0];
    const groupNode = state.nodes[groupId];
    if (!groupNode || !isGroupType(groupNode.type)) return null;

    const childrenIds = (groupNode.childrenIds ?? []).filter(
        (id) => !!state.nodes[id],
    );
    if (childrenIds.length <= 1) return null;

    const aabbMap = new Map();
    const bounds = calculateContentBounds(
        state.nodes,
        childrenIds,
        (_id, node) => getNodeParentLocalAABB(node),
        aabbMap,
    );
    if (!bounds) return null;

    return {
        workIds: childrenIds,
        targetAABBox: getNodeLocalBounds(groupNode),
        aabbMap,
        deltaSpace: "local",
    };
}

function buildSelectionAlignContext(state, ids) {
    const topIds = getTopLevelSelectedIds(state.nodes, ids).filter(
        (id) => !!state.nodes[id],
    );
    if (topIds.length <= 1) return null;

    const aabbMap = new Map();
    const bounds = calculateContentBounds(
        state.nodes,
        topIds,
        (id, node) => getNodeWorldAABB(state.nodes, id, node),
        aabbMap,
    );
    if (!bounds) return null;

    return {
        workIds: topIds,
        targetAABBox: toAABBFromMinMax(bounds),
        aabbMap,
        deltaSpace: "world",
    };
}

function buildAlignContext(state, ids) {
    return (
        buildGroupChildrenAlignContext(state, ids) ??
        buildSelectionAlignContext(state, ids)
    );
}

const EPS = 1e-9;

function resolveLocalDelta(state, id, dx, dy, deltaSpace) {
    if (deltaSpace === "world") {
        return worldDeltaToParentLocalDelta(state.nodes, id, dx, dy);
    }

    return {
        dx: round4(dx),
        dy: round4(dy),
    };
}

function buildAlignedNodesPatch(state, ctx, alignType) {
    const { workIds, targetAABBox, aabbMap, deltaSpace } = ctx;

    const newNodes = {};
    let changed = false;

    for (const id of workIds) {
        const node = state.nodes[id];
        if (!node) continue;

        const nodeAABB = aabbMap.get(id);
        if (!nodeAABB) continue;

        const { dx, dy } = calcAlignWorldDelta(
            alignType,
            nodeAABB,
            targetAABBox,
        );
        if (Math.abs(dx) < EPS && Math.abs(dy) < EPS) continue;

        const localDelta = resolveLocalDelta(state, id, dx, dy, deltaSpace);
        if (!localDelta) continue;

        const prevX = node.x ?? 0;
        const prevY = node.y ?? 0;

        const nextX = round4(prevX + localDelta.dx);
        const nextY = round4(prevY + localDelta.dy);

        if (nextX === prevX && nextY === prevY) continue;

        newNodes[id] = { ...node, x: nextX, y: nextY };
        changed = true;
    }

    if (!changed) return null;
    return newNodes;
}

// Align invariants:
// - Single selected group => align direct children inside group local bounds.
// - Otherwise => align top-level selected items to selection AABB (world space).
// - Always align by AABB, modify only x/y, and patch only changed nodes.
export const alignNodesCommand = (api, ids, alignType) => {
    runCommand(api, `cmd/nodes/align/${alignType}`, (state) => {
        if (!Array.isArray(ids) || ids.length === 0) return null;

        const ctx = buildAlignContext(state, ids);
        if (!ctx) return null;

        const newNodes = buildAlignedNodesPatch(state, ctx, alignType);
        if (!newNodes) return null;

        return {
            patch: {
                nodes: {
                    ...state.nodes,
                    ...newNodes,
                },
            },
            dirty: true,
            tree: true,
        };
    });
};
