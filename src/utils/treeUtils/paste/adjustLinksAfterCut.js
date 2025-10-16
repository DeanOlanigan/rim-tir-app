import { ensureNodeSettingCopy } from "../core/ensureNodeSettingCopy";

export function adjustLinksAfterCut(
    clipboard,
    targetTreeType,
    genSettings,
    nextSettings
) {
    const src = clipboard.type;
    const dst = targetTreeType;
    if (src === dst) return nextSettings;
    let ns = nextSettings;

    for (const rec of genSettings) {
        if (rec.type !== "dataObject") continue;

        const varId = rec.setting?.variableId;
        if (!varId) continue;

        const varRec = ensureNodeSettingCopy(ns, varId);
        if (!varRec) continue;

        const usedIn = {
            send: null,
            receive: null,
            ...(varRec.setting?.usedIn ?? {}),
        };
        usedIn[src] = null;
        usedIn[dst] = rec.id;

        varRec.setting.usedIn = usedIn;
    }

    return ns;
}
