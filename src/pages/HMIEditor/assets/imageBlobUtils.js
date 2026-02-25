const ALLOWED_IMAGE_MIME_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "image/svg+xml", // можно оставить, если хочешь разрешить сразу
]);

export function isSupportedImageMime(mimeType) {
    return (
        typeof mimeType === "string" && ALLOWED_IMAGE_MIME_TYPES.has(mimeType)
    );
}

export function extFromMime(mimeType) {
    switch (mimeType) {
        case "image/png":
            return "png";
        case "image/jpeg":
            return "jpg";
        case "image/webp":
            return "webp";
        case "image/gif":
            return "gif";
        case "image/svg+xml":
            return "svg";
        default:
            return "bin";
    }
}

function arrayBufferToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    let out = "";
    for (let i = 0; i < bytes.length; i++) {
        out += bytes[i].toString(16).padStart(2, "0");
    }
    return out;
}

export async function sha256Blob(blob) {
    const ab = await blob.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", ab);
    return arrayBufferToHex(digest);
}

export async function decodeImageSizeFromBlob(blob) {
    // Вариант через createImageBitmap (быстро и без objectURL, но не везде одинаково для SVG)
    if (typeof createImageBitmap === "function") {
        try {
            const bitmap = await createImageBitmap(blob);
            const size = { width: bitmap.width, height: bitmap.height };
            bitmap.close?.();
            if (size.width > 0 && size.height > 0) return size;
        } catch {
            // fallback ниже
        }
    }

    // Fallback через HTMLImageElement + object URL
    return await new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = () => {
            const width = img.naturalWidth || img.width;
            const height = img.naturalHeight || img.height;
            URL.revokeObjectURL(url);

            if (width > 0 && height > 0) {
                resolve({ width, height });
            } else {
                reject(new Error("Invalid image dimensions"));
            }
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to decode image"));
        };

        img.src = url;
    });
}
