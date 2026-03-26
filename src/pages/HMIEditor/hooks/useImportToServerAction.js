import { useCallback } from "react";
import { useSaveProjectMutation } from "../mutations";
import { buildProjectPackage } from "../ProjectOps/buildProjectPackage";
import { useNodeStore } from "../store/node-store";
import { useAuth } from "@/hooks/useAuth";
import { hasRight } from "@/utils/permissions";
import { toaster } from "@/components/ui/toaster";

export function useImportToServerAction() {
    const saveMutation = useSaveProjectMutation();
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
            if (saveMutation.isPending) return;
            const snapshot = useNodeStore.getState();
            const { projectId } = snapshot.meta;
            const projectName = snapshot.projectName?.trim();

            if (!projectName) {
                toaster.create({
                    title: "Имя проекта не задано",
                    description: "Укажите имя проекта перед сохранением",
                    type: "error",
                });
                return;
            }

            try {
                const { blob } = await buildProjectPackage({
                    state: snapshot,
                    tools,
                });

                await saveMutation.mutateAsync({
                    id: projectId,
                    blob,
                });
                snapshot.markAsImportedToServer();
            } catch (e) {
                console.error(e);
            }
        },
        [saveMutation, user],
    );

    return importToServer;
}
