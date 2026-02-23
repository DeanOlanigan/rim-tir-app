import { SHAPES } from "@/pages/HMIEditor/constants";
import { runCommand } from "../runCommand";
import { recalcGroupsUpwardsDraft } from "../../utils/groups";
import { quantizePatch } from "../../utils/patch/quantize";

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

/**
 * Проверяет, влияет ли патч на геометрию или иерархию.
 */
function isLayoutImpacted(patch) {
    return (
        patchAffectsBBox(patch) ||
        Object.prototype.hasOwnProperty.call(patch, "parentId")
    );
}

/**
 * Определяет группы, которые требуют пересчета.
 */
function collectImpactedGroups(groupsSet, node, patch, oldNode, allNodes) {
    if (!isLayoutImpacted(patch)) return;

    // Старый родитель (из исходного состояния)
    const oldPid = oldNode.parentId;
    if (oldPid && allNodes[oldPid]?.type === SHAPES.group) {
        groupsSet.add(oldPid);
    }

    // Новый родитель или сам узел, если это группа
    const newPid = node.parentId;
    if (newPid && allNodes[newPid]?.type === SHAPES.group) {
        groupsSet.add(newPid);
    }

    if (node.type === SHAPES.group) {
        groupsSet.add(node.id);
    }
}

function update(patchesById, nodes) {
    let draftNodes = null;
    const startGroups = new Set();

    for (const id in patchesById) {
        const base = nodes[id];
        const rawPatch = patchesById[id];
        if (!base || !rawPatch) continue;

        const patch = quantizePatch(rawPatch);

        if (!draftNodes) draftNodes = { ...nodes }; // O(N) Spread в RAF

        const next = { ...base, ...patch };
        draftNodes[id] = next;

        collectImpactedGroups(startGroups, next, patch, base, draftNodes);
    }

    if (!draftNodes) return null;

    if (startGroups.size) {
        recalcGroupsUpwardsDraft(draftNodes, startGroups);
    }

    return { nodes: draftNodes };
}

function mergeIfChanged(base, patch) {
    // быстрый ранний выход
    let changed = false;
    for (const k in patch) {
        if (patch[k] !== base[k]) {
            changed = true;
            break;
        }
    }
    if (!changed) return base;

    return { ...base, ...patch };
}

// Намеренно нарушаем иммутабельность
function updateRaf(patchesById, nodes) {
    let hasChanges = false;
    for (const id in patchesById) {
        const base = nodes[id];
        const patch = patchesById[id];
        if (!base || !patch) continue;

        const next = mergeIfChanged(base, patch);
        if (next === base) continue;
        nodes[id] = next;
        hasChanges = true;
    }
    return hasChanges ? { nodes } : null;
}

export const updateNodesCommand = (api, patchesById) => {
    runCommand(api, "cmd/nodes/updateNodes", (state) => {
        const patch = update(patchesById, state.nodes);
        return patch ? { patch, dirty: true } : null;
    });
};

export const updateNodesRafCommand = (api, patchesById) => {
    runCommand(api, "cmd/nodes/updateNodesRaf", (state) => {
        const patch = updateRaf(patchesById, state.nodes);
        return patch ? { patch } : null;
    });
};

export const updateNodeCommand = (api, id, nodePatch) => {
    return updateNodesCommand(api, { [id]: nodePatch });
};
