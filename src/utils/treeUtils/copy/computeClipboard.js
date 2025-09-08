import { getIdsSetNormalizedContext } from "../core/ids";

export const computeClipboard = (treeType, ctx, selectedIds, cut = false) => {
    if (!selectedIds.length) return null;

    const nodesIds = getIdsSetNormalizedContext(ctx, selectedIds);
    const roots = getRootsOnlyFast(ctx, selectedIds, nodesIds);
    if (!roots.length) return null;

    return {
        type: treeType,
        normalized: sliceCtx(ctx, nodesIds),
        roots,
        ids: Array.from(nodesIds),
        cut,
    };
};

function sliceCtx(ctx, ids) {
    const out = {};

    for (const id of ids) {
        const rec = ctx[id];
        if (!rec) continue;
        const c = cloneSetting(rec);
        if (c.children) c.children = c.children.filter((cid) => ids.has(cid));
        out[id] = c;
    }

    return out;
}

function cloneSetting(rec) {
    if (!rec) return null;
    const out = {
        ...rec,
        setting: { ...(rec.setting ?? {}) },
    };
    if (rec.children) out.children = [...rec.children];
    return out;
}

function getRootsOnlyFast(ctx, selectedIds, idsSet) {
    const roots = [];
    for (const id of selectedIds) {
        const pid = ctx[id]?.parentId ?? null;
        if (!pid || !idsSet.has(pid)) roots.push(id);
    }
    return roots;
}
