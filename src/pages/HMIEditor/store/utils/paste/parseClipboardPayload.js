export function parseClipboardPayload(text) {
    try {
        const data = JSON.parse(text);

        if (data.type !== "rimtir/clipboard") return null;
        if (data.version !== 1) return null;

        return data;
    } catch {
        return null;
    }
}
