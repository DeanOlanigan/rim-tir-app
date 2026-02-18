export function safeFileName(name) {
    return (name || "project")
        .replace(/[\\/:*?"<>|]+/g, "_")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 80);
}

export function stableStringify(value, space = 2) {
    const seen = new WeakSet();

    const normalize = (v) => {
        if (v && typeof v === "object") {
            if (seen.has(v)) return null; // на всякий случай, циклы не ожидаются
            seen.add(v);

            if (Array.isArray(v)) return v.map(normalize);

            const out = {};
            for (const k of Object.keys(v).sort()) {
                out[k] = normalize(v[k]);
            }
            return out;
        }
        return v;
    };

    return JSON.stringify(normalize(value), null, space);
}

function toHex(buffer) {
    const bytes = new Uint8Array(buffer);
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, "0");
    }
    return hex;
}

export async function sha256Bytes(bytes) {
    if (!globalThis.crypto?.subtle) {
        throw new Error(
            "WebCrypto (crypto.subtle) недоступен. Нужен HTTPS или localhost.",
        );
    }
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return toHex(hash);
}

export async function sha256Text(text) {
    const enc = new TextEncoder();
    return sha256Bytes(enc.encode(text));
}

export async function sha256Blob(blob) {
    const ab = await blob.arrayBuffer();
    return sha256Bytes(ab);
}
