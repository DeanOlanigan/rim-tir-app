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
                    backgroundColor: "#254e25ff",
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
