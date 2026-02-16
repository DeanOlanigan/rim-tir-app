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

export const patchStoreRaf = (() => {
    let queuedIds = new Set();
    let queuedPatch = {};
    let frame = null;

    const flush = () => {
        if (!queuedIds.size) {
            frame = null;
            return;
        }

        const ids = Array.from(queuedIds);
        const patchById = queuedPatch;

        try {
            useNodeStore.getState().updateNodesRaf(ids, patchById);
            queuedIds = new Set();
            queuedPatch = {};
            frame = null;
        } catch (e) {
            frame = null;
            throw e;
        } finally {
            queuedIds = new Set();
            queuedPatch = {};
            frame = null;
        }
    };

    const schedule = () => {
        if (!frame) frame = requestAnimationFrame(flush);
    };

    const fn = (ids, patchById) => {
        ids.forEach((id) => {
            queuedIds.add(id);
            queuedPatch[id] = {
                ...(queuedPatch[id] || {}),
                ...(patchById[id] || {}),
            };
        });
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
        queuedIds = new Set();
        queuedPatch = {};
    };

    return fn;
})();
