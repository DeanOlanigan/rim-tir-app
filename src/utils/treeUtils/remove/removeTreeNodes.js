/**
 * Removes nodes from a tree structure, given a set of node ids to remove.
 *
 * @param {Array} nodes Tree nodes to remove nodes from.
 * @param {Set<string>} idsToRemove Set of node ids to remove.
 * @returns {Array} The input tree nodes with nodes removed, if any.
 */
export function removeNodeUtil(nodes, idsToRemove) {
    if (!Array.isArray(nodes) || nodes.length === 0 || idsToRemove.size === 0)
        return nodes;

    const walk = (arr) => {
        let changed = false;
        const out = [];

        for (const node of arr) {
            if (idsToRemove.has(node.id)) {
                changed = true;
                continue;
            }

            const oldChildren = node.children || [];
            const newChildren = oldChildren.length
                ? walk(oldChildren)
                : oldChildren;

            if (newChildren !== oldChildren) {
                changed = true;
                out.push({ ...node, children: newChildren });
            } else {
                out.push(node);
            }
        }

        return changed ? out : arr;
    };

    return walk(nodes);
}

export function deleteNodeUtil(treeApi) {
    if (!treeApi.props.onDelete) return;
    const ids = Array.from(treeApi.selectedIds);
    if (ids.length > 1) {
        let nextFocus = treeApi.mostRecentNode;
        while (nextFocus && nextFocus.isSelected) {
            nextFocus = nextFocus.nextSibling;
        }
        if (!nextFocus) nextFocus = treeApi.lastNode;
        treeApi.focus(nextFocus, { scroll: false });
        treeApi.delete(ids);
    } else {
        const node = treeApi.focusedNode;
        if (node) {
            const sib = node.nextSibling;
            const parent = node.parent;
            treeApi.focus(sib || parent, { scroll: false });
            treeApi.delete(node);
        }
    }
}
