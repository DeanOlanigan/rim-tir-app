import { createInitial } from "../../fabrics";
import { runCommand } from "../runCommand";

export const closeProjectCommand = (api) => {
    runCommand(
        api,
        "cmd/project/close",
        () => {
            return {
                next: createInitial(),
                dirty: false,
                selection: "clear",
            };
        },
        { history: false },
    );
};
