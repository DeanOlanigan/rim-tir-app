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

export const useNodeStore = create(
    devtools(
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
            };
        },
        { name: "node-store" },
    ),
);

function stripNoops(id, patch, nodes) {
    if (!patch) return null;
    const cur = nodes[id];
    if (!cur) return patch;

    let out = null;
    for (const k in patch) {
        if (patch[k] !== cur[k]) {
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
