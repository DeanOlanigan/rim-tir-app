export function deleteNodesInSetCOW(nodes, deleteSet) {
    if (!deleteSet.size) return nodes;
    let out = nodes;

    for (const id of deleteSet) {
        delete out[id];
    }

    return out;
}
