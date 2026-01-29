import { ensureNodeSettingCopy } from "../core/ensureNodeSettingCopy";

export function adjustLinksAfterCut(
    clipboard,
    targetTreeType,
    genSettings,
    nextSettings,
) {
    const src = clipboard.type;
    const dst = targetTreeType;
    if (src === dst) return nextSettings;
    let ns = nextSettings;

    for (const rec of genSettings) {
        if (rec.type !== "dataObject") continue;

        const varId = rec.setting?.variableId;
        if (varId) {
            const varRec = ensureNodeSettingCopy(ns, varId);
            if (varRec) {
                varRec.setting.usedIn = {
                    send: null,
                    receive: null,
                };
            }
        }
        const doRec = ensureNodeSettingCopy(ns, rec.id);
        if (doRec) {
            doRec.setting.variableId = null;
        }
    }

    return ns;
}
