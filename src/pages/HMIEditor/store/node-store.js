import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createMetaSlice } from "./slices/meta-slice";
import { createProjectSlice } from "./slices/project-slice";
import { createActionsSlice } from "./slices/actions-slice";
import { createBindingsSlice } from "./slices/bindings-slice";
import { createGroupsSlice } from "./slices/groups-slice";
import { createIndexSlice } from "./slices/index-slice";
import { createNodesSlice } from "./slices/nodes-slice";
import { createPagesSlice } from "./slices/pages-slice";
import { createUiSlice } from "./slices/ui-slice";

export const useNodeStore = create(
    devtools(
        (set, get) => ({
            ...createActionsSlice(set),
            ...createBindingsSlice(set),
            ...createGroupsSlice(set),
            ...createIndexSlice(set, get),
            ...createMetaSlice(set),
            ...createNodesSlice(set),
            ...createPagesSlice(set),
            ...createProjectSlice(set),
            ...createUiSlice(set),
        }),
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

        queuedIds = new Set();
        queuedPatch = {};
        frame = null;
        useNodeStore.getState().updateNodes(ids, patchById);
    };

    return (ids, patchById) => {
        ids.forEach((id) => {
            queuedIds.add(id);
            queuedPatch[id] = {
                ...(queuedPatch[id] || {}),
                ...(patchById[id] || {}),
            };
        });

        if (!frame) {
            frame = requestAnimationFrame(flush);
        }
    };
})();
