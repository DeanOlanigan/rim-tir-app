export function pruneNestedSelection(ids, parentMap) {
    const set = new Set(ids);
    const res = [];

    for (const id of ids) {
        let p = parentMap[id];
        let nested = false;
        while (p) {
            if (set.has(p)) {
                nested = true;
                break;
            }
            p = parentMap[p];
        }
        if (!nested) res.push(id);
    }

    return res;
}
