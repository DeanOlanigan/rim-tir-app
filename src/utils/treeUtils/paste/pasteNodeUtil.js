import { useValidationStore } from "@/store/validation-store";
import { addNodeUtil } from "../add/addNode";
import { createSettingUtil } from "../add/createSetting";
import { removeAndUnbindSettingsUtil } from "../remove/removeAndUnbindSettings";
import { removeNodeUtil } from "../remove/removeTreeNodes";
import { generateFromClipboard } from "./generateFromClipboard";
import { adjustLinksAfterCut } from "./adjustLinksAfterCut";
import { getDisabledState } from "@/utils/getDisabledState";

export function pasteNodeUtil(ctx, treeType, parentId, initialClipboard) {
    const { clipboard } = ctx;
    if (getDisabledState(ctx, parentId, treeType)) return ctx;

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
            nextSettings,
        );
        useValidationStore.getState().clearErrors(idsSet);
        nextSettings = removeAndUnbindSettingsUtil(nextSettings, idsSet);
    }

    const nextState = {
        [treeType]: nextTargetTree,
        settings: nextSettings,
        clipboard: { ...initialClipboard },
        info: { ...ctx.info, ts: Date.now() },
    };
    if (clipboard.cut && srcTreeType !== treeType) {
        nextState[srcTreeType] = nextSourceTree;
    }

    return nextState;
}
