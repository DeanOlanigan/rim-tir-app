import { nanoid } from "nanoid";

export function generateFromClipboard(
    clipboard,
    targetParentId,
    targetTreeType
) {
    if (!clipboard?.normalized) return null;
    const norm = clipboard.normalized;
    const roots = clipboard.roots ?? inferRootsFromNormalized(norm);

    const oldIds = Object.keys(norm);
    const idMap = new Map();
    for (const oldId of oldIds) {
        idMap.set(oldId, nanoid(12));
    }
    const childrenMap = new Map();

    const newSettings = [];
    for (const oldId of oldIds) {
        const src = norm[oldId];
        if (!src) continue;

        const oldParentId = src.parentId ?? null;
        const isRootOfFragment = !oldParentId || !norm[oldParentId];
        const newParentId = isRootOfFragment
            ? targetParentId ?? null
            : idMap.get(oldParentId);

        const remappedChildren = src.children?.map((c) => idMap.get(c)) ?? [];
        if (remappedChildren.length) {
            childrenMap.set(idMap.get(oldId), remappedChildren);
        }

        const copy = {
            ...src,
            id: idMap.get(oldId),
            parentId: newParentId,
            rootId: targetTreeType,
            setting: { ...(src.setting ?? {}) },
        };
        if (src.children) copy.children = [];

        if (!clipboard.cut) applyCopyRules(copy);

        newSettings.push(copy);
    }

    const byId = Object.create(null);
    for (const rec of newSettings) {
        byId[rec.id] = rec;
    }

    const tree = roots.map((oldRootId) =>
        buildNested(idMap.get(oldRootId), byId, childrenMap)
    );

    return { tree, newSettings };
}

function inferRootsFromNormalized(norm) {
    const hasParent = new Set();
    for (const rec of Object.values(norm)) {
        for (const c of rec.children ?? []) hasParent.add(c);
    }
    const roots = [];
    for (const id of Object.keys(norm)) {
        if (!hasParent.has(id)) roots.push(id);
    }
    return roots;
}

function applyCopyRules(copy) {
    if (copy.type !== "dataObject" && typeof copy.name === "string") {
        copy.name = copy.name + "_copy";
    }
    if (copy.type === "variable") {
        if (copy.setting)
            copy.setting.usedIn = {
                send: null,
                receive: null,
            };
    }
    if (copy.type === "dataObject") {
        if (copy.setting) copy.setting.variableId = null;
    }
}

function buildNested(id, byId, childrenMap) {
    const rec = byId[id];

    const node = {
        id: rec.id,
        node: rec.node,
        type: rec.type,
        name: rec.name,
        path: rec.path,
    };

    const kids = childrenMap.get(id) || rec.children;

    return kids
        ? buildNestedNodeWithChildren(node, kids, byId, childrenMap)
        : node;
}

function buildNestedNodeWithChildren(node, kids, byId, childrenMap) {
    return {
        ...node,
        children: kids.map((kid) => buildNested(kid, byId, childrenMap)),
    };
}
