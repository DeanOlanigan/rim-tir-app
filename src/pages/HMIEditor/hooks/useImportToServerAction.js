import { useCallback } from "react";
import {
    useRenameProjectOnServerMutation,
    useSaveProjectMutation,
} from "../mutations";
import { buildProjectPackage } from "../ProjectOps/buildProjectPackage";
import { safeFileName } from "../ProjectOps/utils";
import { useNodeStore } from "../store/node-store";

export function useImportToServerAction() {
    const saveMutation = useSaveProjectMutation();
    const renameMutation = useRenameProjectOnServerMutation();

    const importToServer = useCallback(
        async (tools) => {
            const state = useNodeStore.getState();
            const { mode, filename: oldFilename } = state.meta;
            const currentProjectName = safeFileName(state.projectName);

            try {
                // ЛОГИКА ПЕРЕИМЕНОВАНИЯ:
                // Если проект пришел с сервера и его имя в инпуте изменилось
                if (mode === "server" && oldFilename !== currentProjectName) {
                    await renameMutation.mutateAsync({
                        oldName: oldFilename,
                        newName: currentProjectName,
                    });
                }

                const { blob } = await buildProjectPackage({ state, tools });

                const formData = new FormData();
                formData.append("file", blob, `${name}.tir-project`);
                formData.append("name", currentProjectName);

                saveMutation.mutate({
                    filename: currentProjectName,
                    project: formData,
                });
                state.markAsImportedToServer();
            } catch (e) {
                console.error(e);
            }
        },
        [saveMutation, renameMutation],
    );

    return importToServer;
}
