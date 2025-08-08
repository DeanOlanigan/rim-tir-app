import { SCOPE } from "./const";

function dfsNew(id, context, ids = []) {
    ids.push(id);
    const children = context[id]?.children || [];
    for (const childId of children) {
        dfsNew(childId, context, ids);
    }
    return ids;
}

function getMeanId(id, context) {
    if (context[id].type === "folder") return getMeanId(context[id].parentId);
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
            const ids = dfsNew(rootId, context);
            return ids;
        }
        case SCOPE.IGNOREFOLDER: {
            const parentId = context[nodeId]?.parentId;
            if (!parentId) return [];
            const meanId = getMeanId(parentId, context);
            const ids = dfsNew(meanId, context);
            return ids;
        }
        default:
            return [];
    }
}
