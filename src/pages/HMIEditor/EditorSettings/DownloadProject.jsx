import { Button, DownloadTrigger } from "@chakra-ui/react";
import { LuDownload } from "react-icons/lu";
import { useNodeStore } from "../store/node-store";

function exportProject(state) {
    return {
        kind: "HMIEditorProject",
        schemaVersion: 1,
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

export const DownloadProject = () => {
    return (
        <DownloadTrigger
            data={data}
            fileName="hmi-editor-project.json"
            mimeType="application/json"
            asChild
        >
            <Button size={"xs"} variant={"surface"}>
                <LuDownload />
                Download project
            </Button>
        </DownloadTrigger>
    );
};
