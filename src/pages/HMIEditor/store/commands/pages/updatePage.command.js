import { runCommand } from "../runCommand";

export const updatePageCommand = (api, id, pagePatch) => {
    return runCommand(api, "cmd/pages/updatePage", (state) => {
        const patch = {
            pages: {
                ...state.pages,
                [id]: { ...state.pages[id], ...pagePatch },
            },
        };

        return {
            patch,
            dirty: true,
        };
    });
};
