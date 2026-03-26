import { QK } from "@/api";
import { toaster } from "@/components/ui/toaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyProjectData } from "./ProjectOps/applyProjectData";
import { messageFromError } from "@/utils/utils";
import { parseProjectPackage } from "./ProjectOps/parseProjectPackage";
import { deleteProject, getProject, saveProject } from "@/api/routes/hmi.api";

export function useDeleteProjectMutation() {
    const q = useQueryClient();

    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            q.invalidateQueries({ queryKey: QK.hmiProjects });
            toaster.create({
                title: "Проект удален",
                description: "Проект успешно удален",
                type: "success",
            });
        },
        onError: (err) => {
            toaster.create({
                title: "Произошла ошибка",
                description: messageFromError(err),
                type: "error",
            });
        },
    });
}

export function useOpenProjectMutation() {
    return useMutation({
        mutationKey: ["openHmiProject"],
        mutationFn: getProject,
        onSuccess: async (blob) => {
            try {
                const { project, files } = await parseProjectPackage(blob);

                applyProjectData(project, {
                    mode: "server",
                    projectId: project.projectId,
                    projectName: project.projectName,
                    files,
                });

                toaster.create({
                    title: "Проект успешно загружен",
                    description: "Проект успешно загружен и распакован",
                    type: "success",
                });
            } catch (error) {
                console.error("Error applying project data:", error);
                toaster.create({
                    title: "Произошла ошибка",
                    description:
                        error.message || "Не удалось прочитать архив проекта",
                    type: "error",
                });
            }
        },
        onError: (err) => {
            toaster.create({
                title: "Произошла ошибка",
                description: messageFromError(err),
                type: "error",
            });
        },
    });
}

export function useSaveProjectMutation() {
    const q = useQueryClient();
    return useMutation({
        mutationKey: ["saveHmiProject"],
        mutationFn: saveProject,
        onSuccess: () => {
            q.invalidateQueries({ queryKey: QK.hmiProjects });
            toaster.create({
                title: "Проект сохранен",
                description: "Проект успешно сохранен",
                type: "success",
            });
        },
        onError: (err) => {
            toaster.create({
                title: "Произошла ошибка",
                description: messageFromError(err),
                type: "error",
            });
        },
    });
}
