import { toaster } from "@/components/ui/toaster";
import { FileUpload, useFileUpload } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { useFitToFrame } from "../canvas/hooks/useFitToFrame";
import { validateProjectStructure } from "./projectSchema";

export const OpenProject = ({ children, tools, width, height }) => {
    const fitToFrame = useFitToFrame(
        tools.canvasRef,
        width,
        height,
        false,
        tools.nodesRef,
    );

    const fileUpload = useFileUpload({
        maxFiles: 1,
        accept: ["application/json"],
        maxFileSize: 15 * 1024 * 1024,
        async onFileAccept(details) {
            const file = details.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const json = JSON.parse(text);

                const res = validateProjectStructure(json);
                if (!res.ok) {
                    toaster.create({
                        type: "error",
                        title: "Неверная структура проекта",
                        description: res.errors.join(", "),
                    });
                    fileUpload.clearFiles();
                    return;
                }

                const project = res.value;

                useNodeStore.getState().open(project);
                useNodeStore.getState().rebuildVarIndex();

                fitToFrame();

                fileUpload.clearFiles();

                toaster.create({
                    type: "success",
                    title: "Проект загружен",
                });
            } catch (error) {
                toaster.create({
                    type: "error",
                    title: "Произошла ошибка",
                    description: error?.message ?? "Неизвестная ошибка",
                });
                fileUpload.clearFiles();
            }
        },
        async onFileReject(details) {
            toaster.create({
                type: "error",
                title: "Файл не загружен",
                description: details?.files
                    ?.flatMap((f) => f.errors || [])
                    .join(", "),
            });
            fileUpload.clearFiles();
        },
    });

    return (
        <FileUpload.RootProvider value={fileUpload}>
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>{children}</FileUpload.Trigger>
        </FileUpload.RootProvider>
    );
};
