import {
    decodeImageSizeFromBlob,
    extFromMime,
    isSupportedImageMime,
    sha256Blob,
} from "./imageBlobUtils";

function normalizeFileName(name) {
    if (!name || typeof name !== "string") return null;
    return name.trim() || null;
}

/**
 * Преобразует File/Blob из clipboard в нормализованный draft для дальнейшей регистрации в assets.
 * Пока без мутации стора.
 */
export async function normalizePastedImageFile(fileOrBlob) {
    if (!fileOrBlob) return null;

    const blob = fileOrBlob;
    const mimeType = blob.type || "";

    if (!isSupportedImageMime(mimeType)) {
        return null;
    }

    const byteSize = Number.isFinite(blob.size) ? blob.size : 0;
    if (byteSize <= 0) {
        return null;
    }

    const [{ width, height }, hash] = await Promise.all([
        decodeImageSizeFromBlob(blob),
        sha256Blob(blob),
    ]);

    const fileName =
        "name" in fileOrBlob ? normalizeFileName(fileOrBlob.name) : null;

    return {
        kind: "image",
        blob,
        mimeType,
        ext: extFromMime(mimeType),
        byteSize,
        width,
        height,
        hash,
        fileName,
    };
}
