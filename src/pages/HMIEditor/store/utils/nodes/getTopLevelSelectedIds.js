import { buildParentOf } from "./buildParentOf";

export function getTopLevelSelectedIds(nodes, selectedIds, rootIds) {
    const selectedSet = new Set(selectedIds);

    const parentOf = buildParentOf(nodes, rootIds);

    return selectedIds.filter((id) => {
        let cur = parentOf[id];
        const guard = new Set();
        while (cur) {
            if (selectedSet.has(cur)) return false;
            if (guard.has(cur)) break;
            guard.add(cur);
            cur = parentOf[cur];
        }
        return true;
    });
}
