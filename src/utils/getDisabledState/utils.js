export function getMeaningNode(ctx, id) {
    let cur = ctx[ctx[id]?.parentId];
    while (cur) {
        const t = cur.type;
        if (t !== "folder" && t !== "dataObject") return cur;
        cur = ctx[cur.parentId];
    }
    return undefined;
}

export function getParentPath(ctx, id) {
    while (id && ctx[id]) {
        if (ctx[id].type !== "folder") return ctx[id].path;
        id = ctx[id]?.parentId ?? null;
    }
    return null;
}
