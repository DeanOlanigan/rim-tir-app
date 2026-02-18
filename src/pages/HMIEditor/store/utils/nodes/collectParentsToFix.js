export function collectParentsToFix(deleteSet, nodes) {
    const parentsToFix = new Set();

    for (const id of deleteSet) {
        const n = nodes[id];
        if (!n) continue;

        const pid = n.parentId ?? null;
        if (pid && !deleteSet.has(pid)) {
            parentsToFix.add(pid);
        }
    }

    return parentsToFix;
}
