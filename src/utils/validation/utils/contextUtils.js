import { NODE_TYPES, SCOPE } from "./const";

function collectSubtreeIds(context, id) {
    const out = [];
    const stack = [id];
    const seen = new Set();

    while (stack.length) {
        const id = stack.pop();
        if (seen.has(id)) continue;
        seen.add(id);

        const node = context[id];
        if (!node) continue;

        out.push(id);
        const children = node.children ?? [];
        for (const childId of children) {
            stack.push(childId);
        }
    }

    return out;
}

function getNearestNonFolderAncestorId(context, id) {
    let curId = id;
    const seen = new Set();

    while (curId) {
        if (seen.has(curId)) return curId;
        seen.add(curId);

        const node = context[curId];
        if (!node) return null;

        if (node.type !== NODE_TYPES.folder) return curId;
        curId = node.parentId ?? null;
    }

    return null;
}

function getParentWithParam(context, id, param) {
    if (!param) return [];
    let curId = id;
    const seen = new Set();

    while (curId) {
        if (seen.has(curId)) break;
        seen.add(curId);

        const node = context[curId];
        if (!node) break;

        const parentId = node.parentId;
        if (!parentId) break;

        const parent = context[parentId];
        if (!parent) break;

        const val = parent.setting?.[param];
        if (val !== undefined) return [parent.id];
        curId = parentId;
    }

    return [];
}

function getSiblingsIds(context, id, includeSelf = true) {
    const node = context[id];
    if (!node) return [];
    const parentId = node.parentId;
    if (!parentId) return [];
    const parent = context[parentId];
    if (!parent) return [];
    const children = parent.children ?? [];
    if (includeSelf) return children.slice();
    const out = [];
    for (const childId of children) {
        if (childId !== id) out.push(childId);
    }
    return out;
}

function filterByType(context, ids, ignore) {
    if (!ignore || ignore.size === 0) return ids;
    const out = [];
    for (const id of ids) {
        const node = context[id];
        if (!node) continue;
        if (!ignore.has(node.type)) out.push(id);
    }
    return out;
}

export function getContextIds(context, nodeId, param, scope, ignore) {
    switch (scope) {
        case SCOPE.SELF: {
            const exist = !!context[nodeId];
            return exist ? filterByType(context, [nodeId], ignore) : [];
        }
        case SCOPE.SIBLINGS: {
            const ids = getSiblingsIds(context, nodeId, true);
            return filterByType(context, ids, ignore);
        }
        case SCOPE.PARENT: {
            const ids = getParentWithParam(context, nodeId, param);
            return filterByType(context, ids, ignore);
        }
        case SCOPE.ROOT: {
            const node = context[nodeId];
            const rootId = node?.rootId;
            if (!rootId) return [];
            const ids = collectSubtreeIds(context, rootId);
            return filterByType(context, ids, ignore);
        }
        case SCOPE.IGNOREFOLDER: {
            const node = context[nodeId];
            const parentId = node?.parentId;
            if (!parentId) return [];
            const meanId = getNearestNonFolderAncestorId(context, parentId);
            if (!meanId) return [];
            const ids = collectSubtreeIds(context, meanId);
            return filterByType(context, ids, ignore);
        }
        default:
            return [];
    }
}
