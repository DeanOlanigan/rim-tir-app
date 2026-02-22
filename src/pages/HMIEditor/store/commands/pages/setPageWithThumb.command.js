import { runCommand } from "../runCommand";

export const setPageWithThumbCommand = (api, id) => {
    runCommand(api, "cmd/pages/changePageWithThumb", (state) => {
        if (state.pageIdWithThumb === id) return null;
        return { patch: { pageIdWithThumb: id } };
    });
};
