import { addNodeToIndex } from "../utils/bindings";

export function indexSubtree(newIndex, nodes, rootId) {
    function walk(id) {
        const node = nodes[id];
        if (!node) return;

        addNodeToIndex(newIndex, node);

        for (const childId of node.childrenIds ?? []) {
            walk(childId);
        }
    }

    walk(rootId);
}
