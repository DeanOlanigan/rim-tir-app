// если выбрали группу и её потомка — потомок выкидывается из списка
export function pruneNestedSelection(ids, nodes) {
    const set = new Set(ids);
    const res = [];

    for (const id of ids) {
        let p = nodes[id]?.parentId ?? null;
        let nested = false;

        while (p) {
            if (set.has(p)) {
                nested = true;
                break;
            }
            p = nodes[p]?.parentId ?? null;
        }

        if (!nested) res.push(id);
    }

    return res;
}
