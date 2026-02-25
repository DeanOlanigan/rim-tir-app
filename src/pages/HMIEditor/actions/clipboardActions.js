import {
    getClipboardImageBlobFromEvent,
    getClipboardTextFromEvent,
    readClipboardImageBlob,
    readClipboardText,
    writeTextToClipboard,
} from "@/utils/clipboard";
import { useNodeStore } from "../store/node-store";
import { useActionsStore } from "../store/actions-store";
import { buildPayload, parseClipboardPayload } from "../store/utils/clipboard";
import { normalizePastedImageFile } from "../assets/normalizePastedImageFile";
import { ensureImageAssetFromDraft } from "../assets/ensureImageAssetFromDraft";
import { buildClipboardPayloadFromImageAsset } from "../store/utils/clipboard/buildImagePayload";

export const copySelection = async (store) => {
    const { selectedIds, nodes } = store;
    if (!selectedIds.length) return;

    const payload = buildPayload({
        nodes,
        selectedIds,
    });
    if (!payload) return;
    const json = JSON.stringify(payload);

    try {
        await writeTextToClipboard(json);
        // Можно вызвать toast: "Скопировано"
    } catch (e) {
        console.error("Copy failed", e);
    }
};

export const cutSelection = async (store) => {
    // 1. Snapshot (фиксируем, ЧТО удалять)
    const { selectedIds, nodes } = store;
    if (!selectedIds.length) return;

    // 2. Prepare Data
    const payload = buildPayload({
        nodes,
        selectedIds,
    });
    if (!payload) return;
    const json = JSON.stringify(payload);

    try {
        // 3. Async Effect
        await writeTextToClipboard(json);

        // 4. Sync State Mutation (вызываем примитив стора)
        // Используем сохраненные selectedIds, чтобы избежать гонки состояний
        store.removeNodes(payload.rootIds);
    } catch (e) {
        console.error("Cut failed", e);
    }
};

function toPointPlacement({ worldX, worldY, gridSize }) {
    return {
        kind: "point",
        x: worldX,
        y: worldY,
        gridSize,
    };
}

async function tryPasteInternalPayloadFromEvent(store, e, pasteCtx) {
    const text = getClipboardTextFromEvent(e);
    if (!text) return false;

    const payload = parseClipboardPayload(text);
    if (!payload) return false;

    store.pastePayload(payload, toPointPlacement(pasteCtx));
    return true;
}

async function tryPasteImageFromEvent(store, e, pasteCtx) {
    const blob = getClipboardImageBlobFromEvent(e);
    if (!blob) return false;

    const imageDraft = await normalizePastedImageFile(blob);
    if (!imageDraft) return false;

    const imageRef = await ensureImageAssetFromDraft(store, imageDraft);
    if (!imageRef) return false;

    const payload = buildClipboardPayloadFromImageAsset(imageRef, pasteCtx, {
        fitRatio: 0.75,
        upscale: false,
    });
    if (!payload) return false;

    store.pastePayload(payload, toPointPlacement(pasteCtx));
    return true;
}

async function tryPasteInternalPayload(store, pasteCtx) {
    const text = await readClipboardText();
    if (!text) return false;

    const payload = parseClipboardPayload(text);
    if (!payload) return false;

    store.pastePayload(payload, toPointPlacement(pasteCtx));
    return true;
}

async function tryPasteImage(store, pasteCtx) {
    const blob = await readClipboardImageBlob();
    if (!blob) return false;

    // TODO (следующий шаг):
    // 1) register/dedup asset
    // 2) build payload with image node
    // 3) store.pastePayload(payload, toPointPlacement(pasteCtx))

    console.log(
        "Image blob pasted (not yet wired to store)",
        blob,
        store,
        pasteCtx,
    );
    return true;
}

export const pasteFromClipboard = async (
    store,
    { worldX, worldY, gridSize },
) => {
    const pasteCtx = { worldX, worldY, gridSize };

    try {
        if (await tryPasteInternalPayload(store, pasteCtx)) return;

        if (await tryPasteImage(store, pasteCtx)) return;
    } catch (e) {
        console.error("Paste failed", e);
    }
};

export function getPasteData(tools) {
    const store = useNodeStore.getState();
    const stage = tools.api.getStage();
    const snapToGrid = useActionsStore.getState().snapToGrid;
    const gridSize = useActionsStore.getState().gridSize;
    const scale = useActionsStore.getState().scale;
    const grid = snapToGrid ? gridSize : 1;
    const pos = stage.getRelativePointerPosition() ?? { x: 0, y: 0 };
    const wSize = stage.size();
    return {
        store,
        worldX: pos.x,
        worldY: pos.y,
        gridSize: grid,
        scale,
        viewportWidth: wSize.width,
        viewportHeight: wSize.height,
    };
}

export async function pasteFromClipboardEvent(
    store,
    e,
    { worldX, worldY, gridSize, scale, viewportHeight, viewportWidth },
) {
    const pasteCtx = {
        worldX,
        worldY,
        gridSize,
        scale,
        viewportHeight,
        viewportWidth,
    };

    try {
        if (await tryPasteInternalPayloadFromEvent(store, e, pasteCtx)) {
            return true;
        }

        if (await tryPasteImageFromEvent(store, e, pasteCtx)) {
            return true;
        }

        return false;
    } catch (err) {
        console.error("Paste from event failed", err);
        return false;
    }
}
