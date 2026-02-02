import { apiv2 } from "@/api/baseUrl";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNodeStore } from "./store/node-store";
import { toaster } from "@/components/ui/toaster";

async function fetchProjec(filename) {
    const { data } = await apiv2.get(`/hmi/project/${filename}`);
    return data;
}

export const useProjectLoader = () => {
    const [searchParams] = useSearchParams();
    const project = searchParams.get("project");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["hmiProject", project],
        queryFn: () => fetchProjec(project),
        enabled: !!project,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    useEffect(() => {
        if (data) {
            useNodeStore.getState().open(data.data, "server", project);
            useNodeStore.getState().rebuildVarIndex();
        }
    }, [data, project]);

    useEffect(() => {
        if (isError) {
            console.error("Error loading project:", error);
            toaster.create({
                type: "error",
                title: "Не удалось загрузить проект",
                description: error?.message ?? "Неизвестная ошибка",
            });
        }
    }, [isError, error]);

    return { isLoading, project };
};
