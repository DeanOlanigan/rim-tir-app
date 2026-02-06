import { nanoid } from "nanoid";
import { withDirty } from "../utils/withDirty";
import { reorderLayersService } from "../services/reorderLayersService";

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

                    const newNodes = { ...state.nodes };
                    ids.forEach((id) => {
                        delete newNodes[id];
                    });

                    const newRootIds = page.rootIds.filter(
                        (nid) => !ids.includes(nid),
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

        reorderLayers: dirty(
            "nodes/reorder",
            (ids, dir) => set((state) => reorderLayersService(state, ids, dir)),
            undefined,
            "nodes/reorder",
        ),
    };
};
