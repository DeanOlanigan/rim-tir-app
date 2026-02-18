export function pruneDeadChildrenCOW(nodes, parentsToFix, deleteSet) {
    let out = nodes;

    for (const pid of parentsToFix) {
        const p = out[pid];
        if (!p) continue;

        const prevKids = p.childrenIds ?? [];
        const nextKids = prevKids.filter((cid) => !deleteSet.has(cid));
        if (nextKids.length === prevKids.length) continue;

        if (out === nodes) out = { ...nodes };
        out[pid] = { ...p, childrenIds: nextKids };
    }

    return out;
}
