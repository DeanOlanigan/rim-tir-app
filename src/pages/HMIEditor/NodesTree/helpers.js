import { useMemo } from "react";
import { useNodeStore } from "../store/node-store";

export const useNodesData = () => {
    const activePageId = useNodeStore((s) => s.activePageId);
    const rootIds = useNodeStore((s) => s.pages[activePageId]?.rootIds || []);
    const treeRev = useNodeStore((s) => s.meta.treeRev || 0);

    return useMemo(() => {
        if (rootIds.length === 0) return [];
        const nodes = useNodeStore.getState().nodes;

        const build = (ids) =>
            ids.map((id) => {
                const n = nodes[id];
                const item = { id };

                const kids = n?.childrenIds;
                if (Array.isArray(kids) && kids.length) {
                    item.children = build(kids);
                }
                return item;
            });

        return build(rootIds);
    }, [activePageId, treeRev, rootIds]);
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
