import { readClipboardText, writeTextToClipboard } from "@/utils/clipboard";
import { useNodeStore } from "../store/node-store";
import { useActionsStore } from "../store/actions-store";
import { buildPayload, parseClipboardPayload } from "../store/utils/clipboard";

export const copySelection = async (store) => {
    const { selectedIds, nodes, pages, activePageId } = store;
    if (!selectedIds.length) return;
    const pageRootIds = pages[activePageId]?.rootIds ?? [];

    const res = buildPayload({
        nodes,
        selectedIds,
        pageRootIds,
    });
    if (!res) return;
    const json = JSON.stringify(res.payload);

    try {
        await writeTextToClipboard(json);
        // Можно вызвать toast: "Скопировано"
    } catch (e) {
        console.error("Copy failed", e);
    }
};

export const cutSelection = async (store) => {
    // 1. Snapshot (фиксируем, ЧТО удалять)
    const { selectedIds, nodes, pages, activePageId } = store;
    if (!selectedIds.length) return;
    const pageRootIds = pages[activePageId]?.rootIds ?? [];

    // 2. Prepare Data
    const res = buildPayload({
        nodes,
        selectedIds,
        pageRootIds,
    });
    if (!res) return;
    const json = JSON.stringify(res.payload);

    try {
        // 3. Async Effect
        await writeTextToClipboard(json);

        // 4. Sync State Mutation (вызываем примитив стора)
        // Используем сохраненные selectedIds, чтобы избежать гонки состояний
        store.removeNodes(res.rootIds);
    } catch (e) {
        console.error("Cut failed", e);
    }
};

export const pasteFromClipboard = async (
    store,
    { worldX, worldY, gridSize },
) => {
    try {
        // 1. Async Effect
        const text = await readClipboardText();
        if (!text) return;

        // 2. Heavy logic (парсинг вне стора)
        const payload = parseClipboardPayload(text);
        if (!payload) return;

        // 3. Sync State Mutation
        // placement { kind: "point", x, y, gridSize } | { kind: "offset", dx, dy, gridSize }
        store.pastePayload(payload, {
            kind: "point",
            x: worldX,
            y: worldY,
            gridSize,
        });
    } catch (e) {
        console.error("Paste failed", e);
    }
};

export function getPasteData(tools) {
    const store = useNodeStore.getState();
    const stage = tools.api.getStage();
    const snapToGrid = useActionsStore.getState().snapToGrid;
    const gridSize = useActionsStore.getState().gridSize;
    const grid = snapToGrid ? gridSize : 1;
    const pos = stage.getRelativePointerPosition() ?? { x: 0, y: 0 };
    return {
        store,
        worldX: pos.x,
        worldY: pos.y,
        gridSize: grid,
    };
}
