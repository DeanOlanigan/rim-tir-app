import { useInteractiveStore } from "./interactive-store";
import { useNodeStore } from "./node-store";
import { quantizePatch } from "./utils/patch/quantize";

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
        const clearedIds = [];

        for (const id in patchById) {
            const raw = patchById[id];
            if (!raw) continue;

            const quant = quantizePatch(raw);
            const cleaned = stripNoops(id, quant, nodes);
            if (!cleaned) {
                clearedIds.push(id);
                continue;
            }

            cleanedPatch[id] = cleaned;
        }

        if (!Object.keys(cleanedPatch).length && clearedIds.length === 0)
            return;

        const int = useInteractiveStore.getState();
        if (int.active) {
            if (Object.keys(cleanedPatch).length)
                int.applyPatchNow(cleanedPatch);
            if (clearedIds.length) int.clearIds(clearedIds);
            return;
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
