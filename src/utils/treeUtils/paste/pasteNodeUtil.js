import { useValidationStore } from "@/store/validation-store";
import { addNodeUtil } from "../add/addNode";
import { createSettingUtil } from "../add/createSetting";
import { removeAndUnbindSettingsUtil } from "../remove/removeAndUnbindSettings";
import { removeNodeUtil } from "../remove/removeTreeNodes";
import { generateFromClipboard } from "./generateFromClipboard";

export function pasteNodeUtil(ctx, treeType, parentId, initialClipboard) {
    const { clipboard } = ctx;
    if (!clipboard?.normalized) return ctx;

    if (clipboard.cut && parentId && clipboard.ids.has(parentId)) return ctx;

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

    // TODO Нужно перебиндить при смене дерева
    let nextSettings = createSettingUtil(ctx.settings, gen.newSettings);
    if (clipboard.cut) {
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
