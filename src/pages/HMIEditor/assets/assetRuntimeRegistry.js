/**
 * runtimeById: Map<string, { blob: Blob, objectUrl?: string }>
 */
const runtimeById = new Map();

export function putAssetRuntime(assetId, blob) {
    if (!assetId || !blob) return;

    const prev = runtimeById.get(assetId);
    if (prev?.objectUrl) {
        URL.revokeObjectURL(prev.objectUrl);
    }

    runtimeById.set(assetId, {
        blob,
        objectUrl: URL.createObjectURL(blob),
    });
}

export function getAssetRuntime(assetId) {
    return runtimeById.get(assetId) || null;
}

export function getAssetObjectUrl(assetId) {
    return runtimeById.get(assetId)?.objectUrl || null;
}

export function removeAssetRuntime(assetId) {
    const rec = runtimeById.get(assetId);
    if (!rec) return;

    if (rec.objectUrl) {
        URL.revokeObjectURL(rec.objectUrl);
    }
    runtimeById.delete(assetId);
}

export function clearAssetRuntimeRegistry() {
    for (const [assetId, rec] of runtimeById.entries()) {
        if (rec?.objectUrl) {
            URL.revokeObjectURL(rec.objectUrl);
        }
        runtimeById.delete(assetId);
    }
}
