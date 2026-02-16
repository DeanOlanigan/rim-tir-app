import {
    closeProjectCommand,
    openProjectCommand,
    renameProjectCommand,
} from "../commands";

export const createProjectSlice = (api) => {
    return {
        projectName: "New project",

        renameProject: (name) => renameProjectCommand(api, name),

        close: () => closeProjectCommand(api),

        open: (project, mode, filename) =>
            openProjectCommand(api, project, mode, filename),
    };
};
