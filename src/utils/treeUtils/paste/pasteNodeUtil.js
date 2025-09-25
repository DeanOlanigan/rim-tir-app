import { useValidationStore } from "@/store/validation-store";
import { addNodeUtil } from "../add/addNode";
import { createSettingUtil } from "../add/createSetting";
import { removeAndUnbindSettingsUtil } from "../remove/removeAndUnbindSettings";
import { removeNodeUtil } from "../remove/removeTreeNodes";
import { generateFromClipboard } from "./generateFromClipboard";
import { adjustLinksAfterCut } from "./adjustLinksAfterCut";
import {
    differentRootTypes,
    incompatibleDomains,
    nodesAllowedInTree,
    sameRootType,
} from "@/utils/getDisabledState";
import { CONNECTIONS_TREES, NODE_TYPES } from "@/config/constants";
import { getMeaningNode } from "@/utils/utils";

function getParentPath(ctx, id) {
    while (id && ctx[id]) {
        if (ctx[id].type !== "folder") return ctx[id].path;
        id = ctx[id]?.parentId ?? null;
    }
    return null;
}

function sameMeaningPath(ctx, parentId) {
    const focusedNodePath =
        ctx.settings[parentId].type === NODE_TYPES.folder
            ? getParentPath(ctx.settings, parentId)
            : ctx.settings[parentId].path ?? "#";
    const meaningNodePath =
        getMeaningNode(ctx.settings, ctx.clipboard.roots[0])?.path ?? null;
    return meaningNodePath && focusedNodePath === meaningNodePath;
}

function validatePaste(ctx, parentId, treeType) {
    if (!ctx.clipboard?.normalized || !ctx.clipboard.type) return true;
    if (!ctx.clipboard.roots?.length) return true;

    if (incompatibleDomains(treeType, ctx.clipboard.type)) return true;
    if (differentRootTypes(parentId, ctx.clipboard)) return true;
    if (CONNECTIONS_TREES.has(treeType)) {
        if (!nodesAllowedInTree(treeType, ctx.clipboard.normalized))
            return true;
        if (!sameRootType(ctx.clipboard)) return true;
        if (!sameMeaningPath(ctx, parentId)) return true;
    }
}

export function pasteNodeUtil(ctx, treeType, parentId, initialClipboard) {
    const { clipboard } = ctx;
    if (validatePaste(ctx, parentId, treeType)) return ctx;

    const gen = generateFromClipboard(clipboard, parentId, treeType);
    if (!gen) return ctx;

    const srcTreeType = clipboard.type;
    const idsSet = clipboard.ids;

    let baseTargetTree = ctx[treeType];
    if (clipboard.cut && srcTreeType === treeType) {
        baseTargetTree = removeNodeUtil(baseTargetTree, idsSet);
    }
    const nextTargetTree = addNodeUtil(baseTargetTree, parentId, gen.tree);

    let nextSourceTree = ctx[srcTreeType];
    if (clipboard.cut && srcTreeType !== treeType) {
        nextSourceTree = removeNodeUtil(nextSourceTree, idsSet);
    }

    let nextSettings = createSettingUtil(ctx.settings, gen.newSettings);
    if (clipboard.cut) {
        nextSettings = adjustLinksAfterCut(
            clipboard,
            treeType,
            gen.newSettings,
            nextSettings
        );
        useValidationStore.getState().clearErrors(idsSet);
        nextSettings = removeAndUnbindSettingsUtil(nextSettings, idsSet);
    }

    const nextState = {
        [treeType]: nextTargetTree,
        settings: nextSettings,
        clipboard: { ...initialClipboard },
    };
    if (clipboard.cut && srcTreeType !== treeType) {
        nextState[srcTreeType] = nextSourceTree;
    }

    return nextState;
}
