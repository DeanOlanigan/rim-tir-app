import { CONNECTIONS_TREES } from "@/config/constants";
import {
    differentRootTypes,
    incompatibleDomains,
    nodesAllowedInTree,
    sameMeaningPath,
    sameRootType,
} from "./rules";

export function getDisabledState(ctx, parentId, treeType) {
    if (!ctx?.clipboard?.normalized || !ctx.clipboard?.type) return true;
    if (!ctx.clipboard.roots?.length) return true;
    if (!ctx?.settings || !parentId || !ctx.settings[parentId]) return true;

    if (incompatibleDomains(treeType, ctx.clipboard.type)) return true;
    if (differentRootTypes(parentId, ctx.clipboard)) return true;

    if (CONNECTIONS_TREES.has(treeType)) {
        if (!nodesAllowedInTree(treeType, ctx.clipboard.normalized))
            return true;
        if (!sameRootType(ctx.clipboard)) return true;
        if (!sameMeaningPath(ctx, parentId)) return true;
    }
    return false;
}
