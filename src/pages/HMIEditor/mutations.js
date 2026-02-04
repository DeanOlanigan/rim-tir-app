import { deleteProject, saveProject } from "@/api/hmi";
import { toaster } from "@/components/ui/toaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

function messageFromError(err) {
    if (isAxiosError(err)) return err.response?.data?.message ?? err.message;
    return err.message ?? "Произошла ошибка";
}

export function useDeleteProjectMutation() {
    const q = useQueryClient();

    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            q.invalidateQueries({ queryKey: ["hmiProjects"] });
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

export function useSaveProjectMutation() {
    const q = useQueryClient();
    return useMutation({
        mutationFn: saveProject,
        onSuccess: () => {
            q.invalidateQueries({ queryKey: ["hmiProjects"] });
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
