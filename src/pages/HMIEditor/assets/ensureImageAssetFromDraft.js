import { nanoid } from "nanoid";
import { putAssetRuntime } from "./assetRuntimeRegistry";

function buildStorageKey(assetId, ext) {
    const safeExt = ext || "bin";
    return `assets/${assetId}.${safeExt}`;
}

export async function ensureImageAssetFromDraft(store, imageDraft) {
    if (!store || !imageDraft || imageDraft.kind !== "image") {
        return null;
    }

    const now = Date.now();

    // Важно: читаем актуальное состояние стора
    const state = store.getState ? store.getState() : store;
    const assetHashIndex = state.assetHashIndex || {};
    const assets = state.assets || {};

    const existingId = assetHashIndex[imageDraft.hash];
    if (existingId && assets[existingId]) {
        // Дедуп: asset уже есть, только обновляем lastUsedAt
        if (typeof state.touchAssetLastUsed === "function") {
            state.touchAssetLastUsed(existingId, now);
        } else if (typeof store.touchAssetLastUsed === "function") {
            store.touchAssetLastUsed(existingId, now);
        }

        // На всякий случай runtime может отсутствовать (например после загрузки проекта)
        putAssetRuntime(existingId, imageDraft.blob);

        const meta = assets[existingId];
        return {
            assetId: existingId,
            mimeType: meta.mimeType,
            width: meta.width,
            height: meta.height,
            byteSize: meta.byteSize,
            hash: meta.hash,
        };
    }

    // Новый asset
    const assetId = nanoid(12);
    const meta = {
        id: assetId,
        kind: "image",

        mimeType: imageDraft.mimeType,
        ext: imageDraft.ext,
        fileName: imageDraft.fileName ?? null,
        byteSize: imageDraft.byteSize,

        width: imageDraft.width,
        height: imageDraft.height,

        hash: imageDraft.hash,

        createdAt: now,
        firstUsedAt: now,
        lastUsedAt: now,

        storageKey: buildStorageKey(assetId, imageDraft.ext),
        source: "clipboard",
    };

    // 1) runtime blob (вне истории)
    putAssetRuntime(assetId, imageDraft.blob);

    // 2) meta в стор
    if (typeof state.upsertAssetMeta === "function") {
        state.upsertAssetMeta(meta);
    } else if (typeof store.upsertAssetMeta === "function") {
        store.upsertAssetMeta(meta);
    } else {
        console.warn("No upsertAssetMeta method found on store");
        return null;
    }

    return {
        assetId,
        mimeType: meta.mimeType,
        width: meta.width,
        height: meta.height,
        byteSize: meta.byteSize,
        hash: meta.hash,
    };
}
