export function insertNodesService({ state, nodes, rootIds, select = true }) {
    const pageId = state.activePageId;
    const page = state.pages[pageId];
    if (!page) return state;

    return {
        nodes: {
            ...state.nodes,
            ...nodes,
        },
        pages: {
            ...state.pages,
            [pageId]: {
                ...page,
                rootIds: [...page.rootIds, ...rootIds],
            },
        },
        selectedIds: select ? rootIds : state.selectedIds,
    };
}
