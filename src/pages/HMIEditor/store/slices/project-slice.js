import { withDirty } from "../utils/withDirty";
import { defaultProjectName } from "../constants";

export const createProjectSlice = (set) => {
    const dirty = withDirty(set);

    return {
        projectName: defaultProjectName,

        renameProject: dirty("project/renameProject", (name) =>
            set(
                (state) => {
                    if (state.projectName === name) return state;
                    return { projectName: name };
                },
                undefined,
                "project/renameProject",
            ),
        ),
    };
};
