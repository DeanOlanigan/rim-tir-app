import { QK } from "@/api";
import { deleteProject, getProject, saveProject } from "@/api/hmi";
import { toaster } from "@/components/ui/toaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyProjectData } from "./ProjectOps/applyProjectData";
import { messageFromError } from "@/utils/utils";
import { useNodeStore } from "./store/node-store";

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
        onSuccess: (data) => {
            applyProjectData(data.data, "server", `${data.data.filename}.json`);
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
            useNodeStore.getState().markAsImportedToServer();
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
