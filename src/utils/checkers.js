export function hasIgnoreAccessor(ctx, id) {
    while (id && ctx[id]) {
        if (ctx[id].isIgnored) return true;
        id = ctx[id]?.parentId ?? null;
    }
    return false;
}

export function isEmpty(v) {
    if (v === undefined) return true;
    if (v === null) return true;
    if (typeof v === "string" && v.trim() === "") return true;
    if (typeof v === "number" && Number.isNaN(v)) return true;
    return !!(typeof v === "boolean" && v === false);
}
