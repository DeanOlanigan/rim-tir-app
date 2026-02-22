import { runCommand } from "../runCommand";

export const markAsImportedToServerCommand = (api) => {
    runCommand(api, "cmd/project/markAsImportedToServer", () => {
        return {
            patch: { meta: { mode: "server" } },
            dirty: "clear",
            selection: "clear",
        };
    });
};
