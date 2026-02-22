import { createInitial } from "../../fabrics";
import { buildIndexesFromNodes } from "../../utils/bindings";
import { runCommand } from "../runCommand";

export const openProjectCommand = (
    api,
    project,
    mode = "new",
    filename = "untitled",
) => {
    runCommand(api, "cmd/project/open", () => {
        const { nodeIndex, varIndex } = buildIndexesFromNodes(project.nodes);

        const next = {
            ...createInitial(),
            meta: { mode, filename, isDirty: false, treeRev: 0 },
            nodes: project.nodes,
            activePageId: project.activePageId,
            pageIdWithThumb: project.pageIdWithThumb,
            pages: project.pages,
            projectName: project.projectName,
            varIndex,
            nodeIndex,
        };

        return {
            next,
            dirty: false,
            selection: "clear",
        };
    });
};
