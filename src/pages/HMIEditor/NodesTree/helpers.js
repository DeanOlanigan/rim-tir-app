import { SHAPES_ICONS } from "../constants";
import { useNodeStore } from "../store/node-store";

export const useNodesData = () => {
    const rootIds = useNodeStore((s) => s.pages[s.activePageId]?.rootIds || []);
    if (rootIds.length === 0) return [];
    function createRecursiveList(items) {
        return items.map((id) => {
            const node = useNodeStore.getState().nodes[id];
            const res = {
                id,
                icon: SHAPES_ICONS[node.type],
            };
            if (node.childrenIds)
                res.children = createRecursiveList(node.childrenIds);
            return res;
        });
    }

    return createRecursiveList(rootIds);
};

export function toSet(ids) {
    return new Set(ids);
}

export function setEquals(a, b) {
    if (a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false;
    return true;
}

export function setDiff(a, b) {
    // a \ b
    const out = [];
    for (const v of a) if (!b.has(v)) out.push(v);
    return out;
}
