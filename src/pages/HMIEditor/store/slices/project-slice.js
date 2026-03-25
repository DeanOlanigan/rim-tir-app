import {
    closeProjectCommand,
    markAsImportedToServerCommand,
    openProjectCommand,
    renameProjectCommand,
} from "../commands";

export const createProjectSlice = (api) => {
    return {
        projectName: "New project",

        renameProject: (name) => renameProjectCommand(api, name),

        close: () => closeProjectCommand(api),

        open: (project, options) => openProjectCommand(api, project, options),

        markAsImportedToServer: () => markAsImportedToServerCommand(api),
    };
};
