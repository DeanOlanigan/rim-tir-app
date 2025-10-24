import { CONNECTIONS_TREES, NODE_TYPES, TREE_TYPES } from "@/config/constants";
import { configuratorConfig } from "@/utils/configurationParser";
import { getMeaningNode, getParentPath } from "./utils";

export const nodesAllowedInTree = (treeType, nodes) =>
    Object.values(nodes).every((node) => {
        const path = node.path;
        const usedIn = configuratorConfig.nodePaths?.[path]?.usedIn;
        if (!usedIn || usedIn === "both") return true;
        return Array.isArray(usedIn)
            ? usedIn.includes(treeType)
            : usedIn === treeType;
    });

export function sameMeaningPath(ctx, parentId) {
    const focusedNodePath =
        ctx.settings[parentId].type === NODE_TYPES.folder
            ? getParentPath(ctx.settings, parentId)
            : ctx.settings[parentId].path ?? "#";
    const meaningNodePath =
        getMeaningNode(ctx.settings, ctx.clipboard.roots[0])?.path ?? null;
    return meaningNodePath && focusedNodePath === meaningNodePath;
}

const isConn = (t) => CONNECTIONS_TREES.has(t);
export const incompatibleDomains = (treeType, bufType) =>
    (treeType === TREE_TYPES.variables && isConn(bufType)) ||
    (bufType === TREE_TYPES.variables && isConn(treeType));

export const differentRootTypes = (focusedId, clipboard) =>
    clipboard.cut && focusedId && clipboard.ids.has(focusedId);

export const sameRootType = (clipboard) => {
    const nodes = clipboard.normalized;
    const firstNode = nodes[clipboard.roots[0]];
    const sourceType = firstNode?.type;
    if (!sourceType) return false;

    for (const id of clipboard.roots) {
        if (nodes[id].type !== sourceType) return false;
    }
    return true;
};
