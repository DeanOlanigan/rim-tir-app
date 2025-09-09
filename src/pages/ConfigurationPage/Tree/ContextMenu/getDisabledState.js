import { CONNECTIONS_TREES, NODE_TYPES, TREE_TYPES } from "@/config/constants";
import { configuratorConfig } from "@/utils/configurationParser";
import { getMeaningNode, getParentType } from "@/utils/utils";

const nodesAllowedInTree = (treeType, nodes) =>
    Object.values(nodes).every((node) => {
        const path = node.path;
        const usedIn = configuratorConfig.nodePaths[path]?.usedIn;
        if (!usedIn || usedIn === "both") return true;
        return Array.isArray(usedIn)
            ? usedIn.includes(treeType)
            : usedIn === treeType;
    });

const sameMeaningPath = (apiPath, firstNodeId, settings) => {
    const focusedNodePath =
        apiPath.focusedNode?.data.type === NODE_TYPES.folder
            ? getParentType({ checkNode: apiPath?.focusedNode })
            : apiPath.focusedNode?.data?.path ?? "#";
    const meaningNodePath = getMeaningNode(firstNodeId, settings)?.path ?? null;
    return meaningNodePath && focusedNodePath === meaningNodePath;
};

const incompatibleDomains = (treeType, bufType) =>
    (treeType === TREE_TYPES.variables && CONNECTIONS_TREES.has(bufType)) ||
    (bufType === TREE_TYPES.variables && CONNECTIONS_TREES.has(treeType));

const differentRootTypes = (focusedId, clipboard) =>
    clipboard.cut && focusedId && (clipboard.ids ?? []).includes(focusedId);

const sameRootType = (clipboard) => {
    const nodes = clipboard.normalized;
    const firstNode = nodes[clipboard.roots[0]];
    const sourceType = firstNode?.type;
    if (!sourceType) return false;

    for (const id of clipboard.roots) {
        if (nodes[id].type !== sourceType) return false;
    }
    return true;
};

export function getDisabledState(apiPath, clipboard, settings) {
    if (!clipboard?.normalized || !clipboard.type) return true;
    if (!clipboard.roots?.length) return true;

    const treeType = apiPath.props.treeType;

    if (incompatibleDomains(treeType, clipboard.type)) return true;

    const focusedId = apiPath.focusedNode?.data?.id;
    if (differentRootTypes(focusedId, clipboard)) return true;

    if (CONNECTIONS_TREES.has(treeType)) {
        if (!nodesAllowedInTree(treeType, clipboard.normalized)) return true;
        if (!sameRootType(clipboard)) return true;
        if (!sameMeaningPath(apiPath, clipboard.roots[0], settings))
            return true;
    }
    return false;
}
