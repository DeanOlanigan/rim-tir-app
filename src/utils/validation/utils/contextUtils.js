import { NODE_TYPES, SCOPE } from "./const";

function collectSubtreeIds(id, context, ids = []) {
    ids.push(id);
    const children = context[id]?.children || [];
    for (const childId of children) {
        collectSubtreeIds(childId, context, ids);
    }
    return ids;
}

function getNearestNonFolderAncestorId(id, context) {
    if (context[id].type === NODE_TYPES.folder)
        return getNearestNonFolderAncestorId(context[id].parentId, context);
    return id;
}

function getParentWithParam(context, nodeId, param) {
    if (!param) return [];
    let parent = context[nodeId];
    while (parent.parentId) {
        parent = context[parent.parentId];
        if (parent.setting) {
            const val = parent.setting[param];
            if (val) return [parent.id];
        }
    }
    return [];
}

export function getContextIds(context, nodeId, param, scope) {
    switch (scope) {
        case SCOPE.SELF:
            return [nodeId];
        case SCOPE.SIBLINGS: {
            const parentId = context[nodeId]?.parentId;
            if (!parentId) return [];
            const parent = context[parentId];
            return parent.children ?? [];
        }
        case SCOPE.PARENT: {
            return getParentWithParam(context, nodeId, param);
        }
        case SCOPE.ROOT: {
            const rootId = context[nodeId]?.rootId;
            if (!rootId) return [];
            const ids = collectSubtreeIds(rootId, context);
            return ids;
        }
        case SCOPE.IGNOREFOLDER: {
            const parentId = context[nodeId]?.parentId;
            if (!parentId) return [];
            const meanId = getNearestNonFolderAncestorId(parentId, context);
            const ids = collectSubtreeIds(meanId, context);
            return ids;
        }
        default:
            return [];
    }
}
