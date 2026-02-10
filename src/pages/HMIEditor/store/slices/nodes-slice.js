import { nanoid } from "nanoid";
import { withDirty } from "../utils/withDirty";
import { reorderLayersService } from "../services/reorderLayersService";
import { buildClipboardJsonService } from "../services/buildClipboardJsonService";
import { writeTextToClipboard } from "@/utils/utils";
import { insertNodesService } from "../services/insertNodesService";
import {
    parseClipboardPayload,
    placeNodesAtPoint,
    readClipboardText,
    rehydrateClipboardNodes,
} from "../utils/paste";
import { collectSubtreeIds } from "../utils/nodes";

export const createNodesSlice = (set, get) => {
    const dirty = withDirty(set);

    return {
        nodes: {},

        addNode: dirty("nodes/addNode", (node) =>
            set(
                (state) => {
                    const pageId = state.activePageId;
                    const page = state.pages[pageId];
                    if (!page) return state;

                    const id = nanoid(12);

                    const newNode = {
                        ...node,
                        id,
                        bindings: { globalVarId: null, items: [] },
                        events: {
                            onClick: [],
                            onContextMenu: [],
                            onDoubleClick: [],
                            onMouseDown: [],
                            onMouseUp: [],
                        },
                    };

                    return {
                        nodes: { ...state.nodes, [id]: newNode },
                        pages: {
                            ...state.pages,
                            [pageId]: {
                                ...page,
                                rootIds: [...page.rootIds, id],
                            },
                        },
                        selectedIds: [id],
                    };
                },
                undefined,
                "nodes/addNode",
            ),
        ),

        removeNode: dirty("nodes/removeNode", (id) => get().removeNodes([id])),

        removeNodes: dirty("nodes/removeNodes", (ids) =>
            set(
                (state) => {
                    const pageId = state.activePageId;
                    const page = state.pages[pageId];
                    if (!page) return state;

                    const idsToDelete = collectSubtreeIds(ids, state.nodes);
                    const deleteSet = new Set(idsToDelete);

                    const newNodes = { ...state.nodes };

                    for (const id in state.nodes) {
                        if (deleteSet.has(id)) {
                            delete newNodes[id];
                            continue;
                        }

                        const node = state.nodes[id];

                        if (node.childrenIds && node.childrenIds.length > 0) {
                            const hasDeadChild = node.childrenIds.some(
                                (childId) => deleteSet.has(childId),
                            );

                            if (hasDeadChild) {
                                newNodes[id] = {
                                    ...node,
                                    childrenIds: node.childrenIds.filter(
                                        (childId) => !deleteSet.has(childId),
                                    ),
                                };
                            }
                        }
                    }

                    const newRootIds = page.rootIds.filter(
                        (nid) => !deleteSet.has(nid),
                    );

                    return {
                        nodes: newNodes,
                        pages: {
                            ...state.pages,
                            [pageId]: {
                                ...page,
                                rootIds: newRootIds,
                            },
                        },
                        selectedIds: [],
                    };
                },
                undefined,
                "nodes/removeNodes",
            ),
        ),

        updateNode: dirty("nodes/updateNode", (id, patch) =>
            set(
                (state) => ({
                    nodes: {
                        ...state.nodes,
                        [id]: { ...state.nodes[id], ...patch },
                    },
                }),
                undefined,
                "nodes/updateNode",
            ),
        ),

        updateNodes: dirty("nodes/updateNodes", (ids, patchesById) =>
            set(
                (state) => ({
                    nodes: {
                        ...state.nodes,
                        ...ids.reduce((acc, id) => {
                            const patch = patchesById[id];
                            if (!patch) return acc;
                            acc[id] = { ...state.nodes[id], ...patch };
                            return acc;
                        }, {}),
                    },
                }),
                undefined,
                "nodes/updateNodes",
            ),
        ),

        reorderLayers: dirty("nodes/reorder", (ids, dir) =>
            set(
                (state) => reorderLayersService(state, ids, dir),
                undefined,
                "nodes/reorder",
            ),
        ),

        copyToClipboard: async () => {
            const { selectedIds, nodes } = get();
            const json = buildClipboardJsonService({ nodes, selectedIds });
            if (!json) return;
            await writeTextToClipboard(json);
        },

        cutToClipboard: async () => {
            const { selectedIds, nodes } = get();
            const json = buildClipboardJsonService({ nodes, selectedIds });
            if (!json) return;
            await writeTextToClipboard(json);
            get().removeNodes(selectedIds);
        },

        pasteFromClipboard: async (worldX, worldY, gridSize) => {
            const text = await readClipboardText();
            if (!text) return;

            const payload = parseClipboardPayload(text);
            if (!payload) return;

            let { newNodes, idMap } = rehydrateClipboardNodes(payload.nodes);

            const newRootIds = payload.rootIds.map((id) => idMap[id]);

            placeNodesAtPoint({
                nodes: newNodes,
                rootIds: newRootIds,
                x: worldX,
                y: worldY,
                gridSize,
            });

            set(
                (state) =>
                    insertNodesService({
                        state,
                        nodes: newNodes,
                        rootIds: newRootIds,
                    }),
                undefined,
                "nodes/pasteFromClipboard",
            );
        },
    };
};
