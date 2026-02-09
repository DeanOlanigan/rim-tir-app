import { useDeleteProjectMutation, useOpenProjectMutation } from "../mutations";
import { fitNodesToFrame, handleActionWithGuard } from "../utils";
import { useNodeStore } from "../store/node-store";
import { toaster } from "@/components/ui/toaster";
import { applyProjectData } from "../ProjectOps/applyProjectData";

export function useProjectManager(tools, onOpenChange) {
    const deleteMutation = useDeleteProjectMutation();
    const openMutation = useOpenProjectMutation();

    const guard = (cb) =>
        handleActionWithGuard(useNodeStore.getState().meta.isDirty, cb);

    const handleOpenServerProject = async (filename) => {
        guard(() => {
            openMutation.mutate(filename, {
                onSuccess: () => {
                    //navigate(`?project=${filename}`, { replace: true });
                    fitNodesToFrame(tools.canvasRef, tools.nodesRef);
                    toaster.create({
                        type: "success",
                        title: "Проект загружен из сервера",
                    });
                    onOpenChange?.({ open: false });
                },
            });
        });
    };

    const handleOpenLocalProject = (projectData, filename) => {
        guard(() => {
            //navigate("/HMIEditor", { replace: true });

            try {
                applyProjectData(projectData, "local", filename);
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
            //navigate("/HMIEditor", { replace: true });

            useNodeStore.getState().close();
            fitNodesToFrame(tools.canvasRef, tools.nodesRef);

            toaster.create({
                type: "success",
                title: "Создан новый проект",
            });

            onOpenChange?.({ open: false });
        });
    };

    const handleDeleteServerProject = async (filename) => {
        deleteMutation.mutate(filename);
    };

    return {
        handleOpenServerProject,
        handleOpenLocalProject,
        handleCreateNewProject,
        handleDeleteServerProject,
    };
}
