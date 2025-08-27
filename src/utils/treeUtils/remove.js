export function removeNodeUtil(nodes, nodeIds) {
    if (!Array.isArray(nodes) || nodes.length === 0) return nodes;

    const walk = (arr) => {
        let changed = false;
        const out = [];

        for (const node of arr) {
            if (nodeIds.has(node.id)) {
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

export function removeSettingUtil(settings, nodeIds) {
    if (!hasAnyToRemove(settings, nodeIds)) return settings;

    const next = { ...settings };
    const parentCopies = new Map();

    for (const id of nodeIds) {
        const node = next[id];
        if (!node) continue;
        const pid = node.parentId;
        if (pid != null) removeChildFromParent(next, parentCopies, pid, id);
        delete next[id];
    }

    return next;
}

function removeChildFromParent(next, parentCopies, parentId, childId) {
    const parent = ensureParentCopy(next, parentCopies, parentId);
    if (!parent || !parent.children?.lenght) return;
    const filtered = parent.children.filter((cid) => cid !== childId);
    if (filtered == parent.children) return;
    parent.children = filtered;
}

function hasAnyToRemove(settings, ids) {
    for (const id of ids) if (settings[id]) return true;
    return false;
}

function ensureParentCopy(map, parentCopies, parentId) {
    if (parentId === null || !map[parentId]) return null;
    if (parentCopies.has(parentId)) return parentCopies.get(parentId);

    const copy = {
        ...map[parentId],
        children: Array.isArray(map[parentId].children)
            ? [...map[parentId].children]
            : [],
    };
    map[parentId] = copy;
    parentCopies.set(parentId, copy);
    return copy;
}

export function removeAndUnbindSettingUtil(settings, idsSet) {
    if (!hasAnyToRemove(settings, idsSet)) return settings;

    let next = { ...settings };
    const parentCopies = new Map();

    for (const id of idsSet) {
        const node = next[id];
        if (!next[id]) continue;

        if (node.parentId != null)
            removeChildFromParent(next, parentCopies, node.parentId, id);

        if (node.variableId != null) {
            const varId = node.variableId;
            if (!idsSet.has(varId) && next[varId]) {
                const v = next[varId];
                if (v.usedIn != null) {
                    if (v.usedIn === id || v.usedIn != null) {
                        next[varId] = { ...v, usedIn: null };
                    }
                }
            }
        }

        delete next[id];
    }
    return next;
}
