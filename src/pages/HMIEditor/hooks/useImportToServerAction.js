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
            if (saveMutation.isPending || renameMutation.isPending) return;
            const snapshot = useNodeStore.getState();
            const { mode, filename: oldFilename } = snapshot.meta;
            const currentProjectName = safeFileName(snapshot.projectName);

            if (!currentProjectName) {
                console.error("Project name is empry after sanitization");
                return;
            }

            try {
                // ЛОГИКА ПЕРЕИМЕНОВАНИЯ:
                // Если проект пришел с сервера и его имя в инпуте изменилось
                if (
                    mode === "server" &&
                    oldFilename &&
                    oldFilename !== currentProjectName
                ) {
                    await renameMutation.mutateAsync({
                        oldName: oldFilename,
                        newName: currentProjectName,
                    });
                }

                const { blob } = await buildProjectPackage({
                    state: snapshot,
                    tools,
                });

                const formData = new FormData();
                formData.append(
                    "file",
                    blob,
                    `${currentProjectName}.tir-project`,
                );
                formData.append("name", currentProjectName);

                await saveMutation.mutateAsync({
                    filename: currentProjectName,
                    project: formData,
                });
                snapshot.markAsImportedToServer();
            } catch (e) {
                console.error(e);
            }
        },
        [saveMutation, renameMutation],
    );

    return importToServer;
}
