import { useCallback } from "react";
import { useSaveProjectMutation } from "../mutations";
import { buildProjectPackage } from "../ProjectOps/buildProjectPackage";
import { safeFileName } from "../ProjectOps/utils";
import { useNodeStore } from "../store/node-store";

export function useImportToServerAction() {
    const saveMutation = useSaveProjectMutation();

    const importToServer = useCallback(
        async (tools) => {
            const projectName = useNodeStore.getState().projectName;
            const name = safeFileName(projectName);
            const state = useNodeStore.getState();
            try {
                const { blob } = await buildProjectPackage({ state, tools });

                const formData = new FormData();
                formData.append("file", blob, `${name}.tir-project`);
                formData.append("name", name);

                saveMutation.mutate({ filename: name, project: formData });
            } catch (e) {
                console.error(e);
            }
        },
        [saveMutation],
    );

    return importToServer;
}
