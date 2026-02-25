import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createMetaSlice } from "./slices/meta-slice";
import { createProjectSlice } from "./slices/project-slice";
import { createNodeEventsSlice } from "./slices/node-events-slice";
import { createBindingsSlice } from "./slices/bindings-slice";
import { createGroupsSlice } from "./slices/groups-slice";
import { createNodesSlice } from "./slices/nodes-slice";
import { createPagesSlice } from "./slices/pages-slice";
import { createUiSlice } from "./slices/ui-slice";
import { quantizePatch } from "./utils/patch/quantize";
import { isNodeHistoryMuted } from "./history-gate";
import { temporal } from "zundo";
import { createAssetsSlice } from "./slices/assets-slice";

function partializeHistory(state) {
    return {
        varIndex: state.varIndex,
        nodeIndex: state.nodeIndex,
        nodes: state.nodes,
        activePageId: state.activePageId,
        pageIdWithThumb: state.pageIdWithThumb,
        pages: state.pages,
        projectName: state.projectName,
        selectedIds: state.selectedIds,
    };
}

// Важно: no-op set(state => state) не должен создавать шаг истории
function historyEquality(a, b) {
    return (
        a.varIndex === b.varIndex &&
        a.nodeIndex === b.nodeIndex &&
        a.nodes === b.nodes &&
        a.activePageId === b.activePageId &&
        a.pageIdWithThumb === b.pageIdWithThumb &&
        a.pages === b.pages &&
        a.projectName === b.projectName &&
        a.selectedIds === b.selectedIds
    );
}

// Трюк: используем diff как "фильтр" для конкретных команд.
// Если возвращаем null — zundo не трекает этот апдейт.
function historyDiff(past) {
    if (isNodeHistoryMuted()) return null;
    // Возвращаем full current как "дельту" (рабочий компромисс)
    // [ ] microdiff
    return past;
}

export const useNodeStore = create(
    devtools(
        temporal(
            (set, get) => {
                const api = { set, get };
                return {
                    ...createNodeEventsSlice(api),
                    ...createBindingsSlice(api),
                    ...createGroupsSlice(api),
                    ...createMetaSlice(api),
                    ...createNodesSlice(api),
                    ...createPagesSlice(api),
                    ...createProjectSlice(api),
                    ...createUiSlice(api),
                    ...createAssetsSlice(api),
                };
            },
            {
                limit: 50,
                partialize: partializeHistory,
                equality: historyEquality,
                diff: historyDiff,
                onSave: (state) => console.log("h saved", state),
            },
        ),
        { name: "node-store" },
    ),
);

const ARRAY_COMPARE_KEYS = new Set(["points", "dash"]);

function arraysEqualShallow(a, b) {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

function valuesEqualByKey(key, nextVal, curVal) {
    if (nextVal === curVal) return true;

    // Только для заранее известных ключей сравниваем массивы поэлементно
    if (ARRAY_COMPARE_KEYS.has(key)) {
        return arraysEqualShallow(nextVal, curVal);
    }

    return false;
}

function stripNoops(id, patch, nodes) {
    if (!patch) return null;

    const cur = nodes[id];
    if (!cur) return patch;

    let out = null;

    for (const k in patch) {
        if (!valuesEqualByKey(k, patch[k], cur[k])) {
            if (!out) out = {};
            out[k] = patch[k];
        }
    }
    return out; // null => нет изменений
}

export const patchStoreRaf = (() => {
    let queuedPatch = {};
    let frame = null;

    const flush = () => {
        frame = null;

        const store = useNodeStore.getState();
        const nodes = store.nodes;

        const patchById = queuedPatch;
        queuedPatch = {};
        const cleanedPatch = {};

        for (const id in patchById) {
            const raw = patchById[id];
            if (!raw) continue;

            const quant = quantizePatch(raw);
            const cleaned = stripNoops(id, quant, nodes);
            if (!cleaned) continue;

            cleanedPatch[id] = cleaned;
        }

        if (!Object.keys(cleanedPatch).length) return;

        store.updateNodesRaf(cleanedPatch);
    };

    const schedule = () => {
        if (!frame) frame = requestAnimationFrame(flush);
    };

    const fn = (patchById) => {
        if (!patchById) return;

        for (const id in patchById) {
            const patch = patchById[id];
            if (!patch) continue;

            queuedPatch[id] = {
                ...(queuedPatch[id] || {}),
                ...patch,
            };
        }

        schedule();
    };

    fn.flushNow = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = null;
        flush();
    };

    fn.cancel = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = null;
        queuedPatch = {};
    };

    return fn;
})();
