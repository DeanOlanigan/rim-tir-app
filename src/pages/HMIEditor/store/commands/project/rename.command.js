import { runCommand } from "../runCommand";

export const renameProjectCommand = (api, name) => {
    return runCommand(api, "cmd/project/rename", (state) => {
        if (state.projectName === name) return null;
        const patch = { projectName: name };
        return {
            patch,
            dirty: true,
        };
    });
};
