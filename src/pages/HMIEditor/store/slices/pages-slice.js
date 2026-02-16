import { createDefaultPages } from "../fabrics";
import {
    addPageCommand,
    removePageCommand,
    setActiveCommand,
    updatePageCommand,
} from "../commands";

export const createPagesSlice = (api) => {
    return {
        activePageId: "page-1",
        pages: createDefaultPages(),

        setActivePage: (pageId) => setActiveCommand(api, pageId),

        addPage: (name, type) => addPageCommand(api, name, type),

        updatePage: (pageId, pagePatch) =>
            updatePageCommand(api, pageId, pagePatch),

        removePage: (pageId) => removePageCommand(api, pageId),
    };
};
