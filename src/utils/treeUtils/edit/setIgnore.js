export function setIgnoreUtil(ctx, ids, value) {
    if (!ids.length) return;
    let next = ctx;
    let changed = false;
    for (const id of ids) {
        const cur = next[id];
        if (!cur || cur.isIgnored === value) continue;
        if (!changed) next = { ...next };
        next[id] = { ...cur, isIgnored: value };
        changed = true;
    }
    return changed ? next : ctx;
}
