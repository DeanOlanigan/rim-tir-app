import { DownloadTrigger } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { buildProjectPackage } from "./buildProjectPackage";
import { safeFileName } from "./utils";

export const DownloadProject = ({ children, tools }) => {
    const generateZipData = async () => {
        const state = useNodeStore.getState();
        const { blob } = await buildProjectPackage({ state, tools });

        return blob;
    };

    const name = safeFileName(useNodeStore.getState().projectName);

    return (
        <DownloadTrigger
            data={generateZipData}
            fileName={`${name}.tir-project`}
            mimeType="application/octet-stream"
            asChild
        >
            {children}
        </DownloadTrigger>
    );
};
