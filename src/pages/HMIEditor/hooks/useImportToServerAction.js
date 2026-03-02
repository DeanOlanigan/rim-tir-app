import { useCallback } from "react";
import {
    useRenameProjectOnServerMutation,
    useSaveProjectMutation,
} from "../mutations";
import { buildProjectPackage } from "../ProjectOps/buildProjectPackage";
import { safeFileName } from "../ProjectOps/utils";
import { useNodeStore } from "../store/node-store";
import { useAuth } from "@/hooks/useAuth";
import { hasRight } from "@/utils/permissions";
import { toaster } from "@/components/ui/toaster";

export function useImportToServerAction() {
    const saveMutation = useSaveProjectMutation();
    const renameMutation = useRenameProjectOnServerMutation();
    const { user } = useAuth();

    const importToServer = useCallback(
        async (tools) => {
            if (!hasRight(user, "hmi.upload")) {
                toaster.create({
                    title: "Недостаточно прав",
                    description: "Недостаточно прав для выполнения операции",
                    type: "error",
                });
                return;
            }
            if (saveMutation.isPending || renameMutation.isPending) return;
            const snapshot = useNodeStore.getState();
            const { mode, filename: oldFilename } = snapshot.meta;
            const currentProjectName = safeFileName(snapshot.projectName);

            if (!currentProjectName) {
                console.error("Project name is empty after sanitization");
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
        [saveMutation, renameMutation, user],
    );

    return importToServer;
}
