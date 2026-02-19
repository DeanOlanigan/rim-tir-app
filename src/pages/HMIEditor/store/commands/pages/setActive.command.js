import { runCommand } from "../runCommand";

export const setActiveCommand = (api, id) => {
    runCommand(api, "cmd/pages/setActivePage", (state) => {
        if (state.activePageId === id) return null;
        return {
            patch: {
                activePageId: id,
            },
            selection: "clear",
        };
    });
};
