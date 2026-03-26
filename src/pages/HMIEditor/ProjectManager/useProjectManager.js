import { useDeleteProjectMutation, useOpenProjectMutation } from "../mutations";
import { fitNodesToFrame, handleActionWithGuard } from "../utils";
import { useNodeStore } from "../store/node-store";
import { toaster } from "@/components/ui/toaster";
import { applyProjectData } from "../ProjectOps/applyProjectData";
import { nanoid } from "nanoid";

export function useProjectManager(tools, onOpenChange) {
    const deleteMutation = useDeleteProjectMutation();
    const openMutation = useOpenProjectMutation();

    const guard = (cb) =>
        handleActionWithGuard(useNodeStore.getState().meta.isDirty, cb);

    const handleOpenServerProject = async (id) => {
        guard(() => {
            openMutation.mutate(
                { id },
                {
                    onSuccess: () => {
                        fitNodesToFrame(tools.canvasRef, tools.nodesRef);
                        onOpenChange?.({ open: false });
                    },
                },
            );
        });
    };

    const handleOpenLocalProject = (projectData, sourceFilename, files) => {
        guard(() => {
            try {
                applyProjectData(projectData, {
                    mode: "local",
                    projectId: nanoid(12),
                    importedFromProjectId: projectData.projectId ?? null,
                    projectName: projectData.projectName,
                    sourceFilename,
                    files,
                });
                fitNodesToFrame(tools.canvasRef, tools.nodesRef);
                toaster.create({
                    type: "success",
                    title: "Проект загружен из локального файла",
                });
                onOpenChange?.({ open: false });
            } catch (err) {
                console.error("Error applying project data:", err);
                toaster.create({
                    type: "error",
                    title: "Произошла ошибка",
                    description: err?.message ?? "Неизвестная ошибка",
                });
            }
        });
    };

    const handleCreateNewProject = () => {
        guard(() => {
            useNodeStore.getState().close();
            useNodeStore.temporal.getState().clear();
            fitNodesToFrame(tools.canvasRef, tools.nodesRef);

            toaster.create({
                type: "success",
                title: "Создан новый проект",
            });

            onOpenChange?.({ open: false });
        });
    };

    const handleDeleteServerProject = async (id) => {
        deleteMutation.mutate({ id });
    };

    return {
        handleOpenServerProject,
        handleOpenLocalProject,
        handleCreateNewProject,
        handleDeleteServerProject,
    };
}
