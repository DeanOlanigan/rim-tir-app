export async function writeTextToClipboard(text) {
    await navigator.clipboard.writeText(text);
}

export async function readClipboardText() {
    try {
        return await navigator.clipboard.readText();
    } catch {
        return null;
    }
}
