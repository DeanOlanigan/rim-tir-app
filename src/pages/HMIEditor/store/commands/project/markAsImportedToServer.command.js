import { safeFileName } from "@/pages/HMIEditor/ProjectOps/utils";
import { runCommand } from "../runCommand";

export const markAsImportedToServerCommand = (api) => {
    runCommand(api, "cmd/project/markAsImportedToServer", (state) => {
        return {
            patch: {
                meta: {
                    ...state.meta,
                    mode: "server",
                    filename: safeFileName(state.projectName),
                },
            },
            dirty: "clear",
            selection: "clear",
        };
    });
};
