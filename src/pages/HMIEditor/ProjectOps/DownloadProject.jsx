import { DownloadTrigger } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";

function exportProject(state) {
    return {
        kind: "HMIEditorProject",
        schemaVersion: 2,
        projectName: state.projectName,
        activePageId: state.activePageId,
        pages: state.pages,
        nodes: state.nodes,
    };
}

const data = async () => {
    const state = useNodeStore.getState();
    const project = exportProject(state);
    return JSON.stringify(project, null, 2);
};

export const DownloadProject = ({ children }) => {
    return (
        <DownloadTrigger
            data={data}
            fileName="hmi-editor-project.json"
            mimeType="application/json"
            asChild
        >
            {children}
        </DownloadTrigger>
    );
};
