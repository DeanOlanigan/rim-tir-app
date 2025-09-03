import { nanoid } from "nanoid";

/* ================================================================= */
/* ======================== NODE OPERATIONS ======================== */
/* ================================================================= */

export function copyTreeUtil(treeApi, idSet, isCut) {
    function recursive(node) {
        const copiedData = { ...node.data };
        if (!isCut) {
            copiedData.name = copiedData.name + "_copy";
            if (copiedData.type === "dataObject") copiedData.name = "";
        }
        if (node.children?.length > 0) {
            return {
                ...copiedData,
                children: node.children.map(recursive),
            };
        }
        return copiedData;
    }
    const copy = [];
    for (const id of idSet) {
        copy.push(recursive(treeApi.get(id)));
    }
    return copy;
}

export function ignoreNodeUtil(
    nodes,
    ids,
    ignore,
    aggregateToParents = true,
    ignoreParam
) {
    const idsSet = new Set(ids);

    function update(nodes) {
        return nodes.map((node) => {
            const shouldUpdate = idsSet.has(node.id);

            if (shouldUpdate) {
                /* const newChildren =
                    node.children?.length > 0
                        ? propagateIgnore(node.children, ignore, ignoreParam)
                        : node.children; */

                return {
                    ...node,
                    [ignoreParam]: ignore,
                    //...(newChildren && { children: newChildren }),
                };
            }

            let newChildren = node.children;
            if (node.children?.length > 0) {
                newChildren = update(node.children);
            }

            let newIsIgnored = node[ignoreParam];

            if (aggregateToParents && newChildren && newChildren.length > 0) {
                const allIgnored = newChildren.every(
                    (child) => child[ignoreParam]
                );
                newIsIgnored = allIgnored;
            }

            const isChildrenChanged = newChildren !== node.children;
            const isIgnoredChanged = newIsIgnored !== node[ignoreParam];

            if (!isChildrenChanged && !isIgnoredChanged) {
                return node;
            }

            return {
                ...node,
                ...(isIgnoredChanged && { [ignoreParam]: newIsIgnored }),
                ...(isChildrenChanged && { children: newChildren }),
            };
        });
    }

    function propagateIgnore(nodes, ignore, ignoreParam) {
        return nodes.map((node) => ({
            ...node,
            [ignoreParam]: ignore,
            ...(node.children?.length > 0 && {
                children: propagateIgnore(node.children, ignore, ignoreParam),
            }),
        }));
    }

    return update(nodes);
}

/* ================================================================= */
/* ====================== SETTINGS OPERATIONS ====================== */
/* ================================================================= */

export function copySettingsUtil(settings, ids, isCut) {
    const copy = {};
    for (const id of ids) {
        copy[id] = {
            ...settings[id],
            setting: { ...settings[id].setting },
        };
        if (copy[id].type === "variable") copy[id].setting.usedIn = "";
        if (!isCut) {
            copy[id].name = copy[id].name + "_copy";
            if (copy[id].type === "dataObject")
                copy[id].setting.variableId = "";
        }
    }
    return copy;
}

/* ================================================================= */
/* ============================== UTILS ============================ */
/* ================================================================= */

export function generateNewIds(copyTree, copySettings, parentId, settings) {
    const idMap = new Map();
    const newSettings = {};

    function recursive(node) {
        const oldId = node.id;
        const newId = nanoid(12);

        idMap.set(oldId, newId);

        const newNode = {
            ...node,
            id: newId,
            isCutted: false,
            children: node.children?.map(recursive),
        };
        return newNode;
    }

    const newTree = copyTree.map(recursive);

    for (const [oldId, setting] of Object.entries(copySettings)) {
        const newId = idMap.get(oldId);
        const newParentId = idMap.get(setting.parentId) ?? null;

        if (setting.type === "dataObject" && setting.setting.variableId) {
            settings[setting.setting.variableId].setting.usedIn = newId;
        }

        /* const newChildren = setting.children
            ?.map((child) => idMap.get(child))
            .filter(Boolean); */

        newSettings[newId] = {
            ...setting,
            id: newId,
            parentId: newParentId,
            isCutted: false,
            children: [],
        };
        if (setting.type === "variable" || setting.type === "dataObject") {
            delete newSettings[newId].children;
        }
    }

    for (const rootNode of newTree) {
        const rootNodeId = rootNode.id;
        newSettings[rootNodeId] = {
            ...newSettings[rootNodeId],
            parentId: parentId,
        };
    }

    return {
        tree: newTree,
        settings: newSettings,
    };
}
