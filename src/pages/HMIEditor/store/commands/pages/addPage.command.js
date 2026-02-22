import { nanoid } from "nanoid";
import { runCommand } from "../runCommand";

export const addPageCommand = (api, name = "New page", type = "SCREEN") => {
    runCommand(api, "cmd/pages/addPage", (state) => {
        const id = nanoid(12);

        const patch = {
            pages: {
                ...state.pages,
                [id]: {
                    id,
                    name,
                    rootIds: [],
                    type,
                    backgroundColor: "#1E1E1E",
                },
            },
            activePageId: id,
        };
        return {
            patch,
            dirty: true,
            selection: "clear",
        };
    });
};
