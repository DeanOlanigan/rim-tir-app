import { toaster } from "@/components/ui/toaster";
import { FileUpload, useFileUpload } from "@chakra-ui/react";

export const OpenProject = ({ children, onProjectLoad }) => {
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
                onProjectLoad(json, file.name);
            } catch (error) {
                toaster.create({
                    type: "error",
                    title: "Произошла ошибка",
                    description: error?.message ?? "Неизвестная ошибка",
                });
            } finally {
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
