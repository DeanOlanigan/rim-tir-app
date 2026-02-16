import {
    CLIPBOARD_TYPE,
    CLIPBOARD_TYPE_VERSION,
} from "@/pages/HMIEditor/constants";

export function parseClipboardPayload(text) {
    try {
        const data = JSON.parse(text);

        if (data.type !== CLIPBOARD_TYPE) return null;
        if (data.version !== CLIPBOARD_TYPE_VERSION) return null;

        return data;
    } catch {
        return null;
    }
}
