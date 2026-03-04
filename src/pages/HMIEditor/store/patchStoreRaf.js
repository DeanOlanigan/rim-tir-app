import { useInteractiveStore } from "./interactive-store";
import { quantizePatch } from "./utils/patch/quantize";
import { patchesEqual, stripNoops } from "./utils/patchesOps";

function applyTouchedKeysToOverlay(prevOverlay, quant, cleaned) {
    const touchedKeys = Object.keys(quant);
    let next = prevOverlay ? { ...prevOverlay } : {};

    // 1) удаляем все ключи, которые пришли в текущем raw/quant
    for (const key of touchedKeys) {
        if (key in next) delete next[key];
    }

    // 2) добавляем только те touched-ключи, которые реально отличаются от base
    if (cleaned) {
        for (const key in cleaned) {
            next[key] = cleaned[key];
        }
    }

    return Object.keys(next).length ? next : null;
}

export const patchStoreRaf = (() => {
    let queuedPatch = {};
    let frame = null;

    const flush = () => {
        frame = null;
        const patchById = queuedPatch;
        queuedPatch = {};

        const int = useInteractiveStore.getState();
        if (!int.active || !int.baselineNodes) {
            console.warn(
                "patchStoreRaf.flush called while interactive store is inactive",
            );
            return;
        }

        const baseNodes = int.baselineNodes;
        const nextOverlayById = {};
        const clearedIds = [];

        for (const id in patchById) {
            const raw = patchById[id];
            if (!raw) continue;

            const quant = quantizePatch(raw);

            const cleaned = stripNoops(id, quant, baseNodes);

            const prevOverlay = int.patchesById[id];
            const nextOverlay = applyTouchedKeysToOverlay(
                prevOverlay,
                quant,
                cleaned,
            );

            if (!nextOverlay) {
                if (prevOverlay) clearedIds.push(id);
                continue;
            }

            if (patchesEqual(prevOverlay, nextOverlay)) continue;

            nextOverlayById[id] = nextOverlay;
        }

        const nextOverlayLength = Object.keys(nextOverlayById).length;

        if (!nextOverlayLength && clearedIds.length === 0) return;

        if (nextOverlayLength) {
            int.replacePatches(nextOverlayById);
        }
        if (clearedIds.length) {
            int.clearIds(clearedIds);
        }
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
