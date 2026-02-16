import { runCommand } from "../runCommand";

function update(ids, patchesById, nodes) {
    const updates = {};
    let hasChanges = false;
    for (const id of ids) {
        const base = nodes[id];
        const patch = patchesById[id];
        if (!base || !patch) continue;
        updates[id] = { ...base, ...patch };
        hasChanges = true;
    }
    if (!hasChanges) return null;

    return {
        nodes: {
            ...nodes, // O(N) Spread в RAF
            ...updates,
        },
    };
}

export const updateNodesCommand = (api, ids, patchesById) => {
    runCommand(api, "cmd/nodes/updateNodes", (state) => {
        const patch = update(ids, patchesById, state.nodes);
        return patch ? { patch, dirty: true } : null;
    });
};

export const updateNodesRafCommand = (api, ids, patchesById) => {
    runCommand(api, "cmd/nodes/updateNodesRaf", (state) => {
        const patch = update(ids, patchesById, state.nodes);
        return patch ? { patch } : null;
    });
};

export const updateNodeCommand = (api, id, nodePatch) => {
    return updateNodesCommand(api, [id], { [id]: nodePatch });
};
