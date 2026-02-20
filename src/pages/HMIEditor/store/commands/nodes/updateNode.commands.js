import { SHAPES } from "@/pages/HMIEditor/constants";
import { runCommand } from "../runCommand";
import { recalcGroupsUpwardsDraft } from "../../utils/groups";

const AFFECTS_BBOX_KEYS = new Set([
    "x",
    "y",
    "rotation",
    "width",
    "height",
    "skewX",
    "skewY",
    "scaleX",
    "scaleY",
    "type", // важно: влияет на isHasRadius() => и матрица, и bounds меняются
    "childrenIds", // если этим же апдейтом меняешь детей группы
]);

function patchAffectsBBox(patch) {
    if (!patch) return false;
    for (const k in patch) {
        if (AFFECTS_BBOX_KEYS.has(k)) return true;
    }
    return false;
}

function update(ids, patchesById, nodes) {
    const baseNodes = nodes;
    const draftNodes = { ...baseNodes }; // O(N) Spread в RAF
    let hasChanges = false;
    const startGroups = new Set();

    for (const id of ids) {
        const base = baseNodes[id];
        const patch = patchesById[id];
        if (!base || !patch) continue;

        const next = { ...base, ...patch };
        draftNodes[id] = next;
        hasChanges = true;

        const affects =
            patchAffectsBBox(patch) ||
            Object.prototype.hasOwnProperty.call(patch, "parentId");

        if (!affects) continue;

        const oldPid = base.parentId ?? null;
        const newPid = next.parentId ?? null;

        if (oldPid && baseNodes[oldPid]?.type === SHAPES.group)
            startGroups.add(oldPid);
        if (newPid && draftNodes[newPid]?.type === SHAPES.group)
            startGroups.add(newPid);

        if (next.type === SHAPES.group) startGroups.add(id);
    }

    if (!hasChanges) return null;

    if (startGroups.size) {
        recalcGroupsUpwardsDraft(draftNodes, startGroups);
    }

    return {
        nodes: draftNodes,
    };
}

// Намеренно нарушаем иммутабельность
function updateRaf(ids, patchesById, nodes) {
    let hasChanges = false;
    for (const id of ids) {
        const base = nodes[id];
        const patch = patchesById[id];
        if (!base || !patch) continue;
        nodes[id] = { ...base, ...patch };
        hasChanges = true;
    }
    return hasChanges ? { nodes } : null;
}

export const updateNodesCommand = (api, ids, patchesById) => {
    runCommand(api, "cmd/nodes/updateNodes", (state) => {
        const patch = update(ids, patchesById, state.nodes);
        return patch ? { patch, dirty: true } : null;
    });
};

export const updateNodesRafCommand = (api, ids, patchesById) => {
    runCommand(api, "cmd/nodes/updateNodesRaf", (state) => {
        const patch = updateRaf(ids, patchesById, state.nodes);
        return patch ? { patch } : null;
    });
};

export const updateNodeCommand = (api, id, nodePatch) => {
    return updateNodesCommand(api, [id], { [id]: nodePatch });
};
