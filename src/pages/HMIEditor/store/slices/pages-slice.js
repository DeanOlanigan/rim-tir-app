import { nanoid } from "nanoid";
import { withDirty } from "../utils/withDirty";
import { defaultPageId, defaultPages } from "../constants";
import { removePageService } from "../services/pageService";

export const createPagesSlice = (set) => {
    const dirty = withDirty(set);

    return {
        activePageId: defaultPageId,
        pages: defaultPages,

        setActivePage: (pageId) =>
            set(
                (state) => {
                    if (state.activePageId === pageId) return state;
                    return { activePageId: pageId, selectedIds: [] };
                },
                undefined,
                "pages/setActivePage",
            ),

        addPage: dirty("pages/addPage", (name = "New page", type = "SCREEN") =>
            set(
                (state) => {
                    const id = nanoid(12);

                    return {
                        pages: {
                            ...state.pages,
                            [id]: {
                                id,
                                name,
                                rootIds: [],
                                type,
                                backgroundColor: "#254e25ff",
                            },
                        },
                        activePageId: id,
                        selectedIds: [],
                    };
                },
                undefined,
                "pages/addPage",
            ),
        ),

        updatePage: dirty("pages/updatePage", (pageId, patch) =>
            set(
                (state) => ({
                    pages: {
                        ...state.pages,
                        [pageId]: { ...state.pages[pageId], ...patch },
                    },
                }),
                undefined,
                "pages/updatePage",
            ),
        ),

        removePage: dirty("pages/removePage", (pageId) =>
            set(
                (state) => {
                    return removePageService(state, pageId);
                },
                undefined,
                "pages/removePage",
            ),
        ),
    };
};
