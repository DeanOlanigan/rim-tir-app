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

const IMAGE_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];

function isImageMime(type) {
    return typeof type === "string" && type.startsWith("image/");
}

function pickImageType(types) {
    if (!Array.isArray(types) || types.length === 0) return null;

    // приоритет можно настроить
    for (const mime of IMAGE_MIME_TYPES) {
        if (types.includes(mime)) return mime;
    }

    // fallback: любой image/*
    return types.find(isImageMime) || null;
}

export async function readClipboardImageBlob() {
    try {
        if (!navigator?.clipboard?.read) return null;

        const items = await navigator.clipboard.read();
        if (!Array.isArray(items) || items.length === 0) return null;

        for (const item of items) {
            const mime = pickImageType(item.types);
            if (!mime) continue;

            const blob = await item.getType(mime);
            if (!blob) continue;

            // Нормализуем type (иногда бывает пустым)
            if (!blob.type && mime) {
                const ab = await blob.arrayBuffer();
                return new Blob([ab], { type: mime });
            }

            return blob;
        }

        return null;
    } catch {
        return null;
    }
}

/** ===== DOM paste event helpers ===== */

export function getClipboardTextFromEvent(e) {
    try {
        return e?.clipboardData?.getData?.("text/plain") || null;
    } catch {
        return null;
    }
}

export function getClipboardImageBlobFromEvent(e) {
    const dt = e?.clipboardData;
    if (!dt) return null;

    // 1) Сначала items (обычно самый надежный источник)
    const items = Array.from(dt.items || []);
    for (const item of items) {
        // item.kind: "string" | "file"
        // item.type: mime, например image/png
        if (item.kind === "file" && isImageMime(item.type)) {
            const file = item.getAsFile?.();
            if (file) return file;
        }
    }

    // 2) Потом files (иногда браузер кладет сюда)
    const files = Array.from(dt.files || []);
    for (const file of files) {
        if (isImageMime(file.type)) return file;
    }

    return null;
}

export function debugClipboardEvent(e) {
    const dt = e?.clipboardData;
    if (!dt) return null;

    return {
        types: Array.from(dt.types || []),
        items: Array.from(dt.items || []).map((item) => ({
            kind: item.kind,
            type: item.type,
        })),
        files: Array.from(dt.files || []).map((f) => ({
            name: f.name,
            type: f.type,
            size: f.size,
        })),
    };
}
