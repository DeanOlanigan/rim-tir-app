import { toaster } from "@/components/ui/toaster";
import { FileUpload, useFileUpload } from "@chakra-ui/react";
import { parseProjectPackage } from "./parseProjectPackage";
import { MAX_ARCHIVE_FILE_SIZE, MAX_ARCHIVE_FILES } from "../constants";

const ACCEPT = [".tir-project"];

const errorMessages = {
    TOO_MANY_FILES: "Слишком много файлов (максимум 1)",
    FILE_INVALID_TYPE:
        "Неподдерживаемый тип файла (поддерживаются: .tir-project, .json)",
    FILE_TOO_LARGE: "Слишком большой файл (максимум 15MB)",
    FILE_TOO_SMALL: "Слишком малый файл",
    FILE_INVALID: "Некорректный файл",
    FILE_EXISTS: "Файл уже существует",
};

export const OpenProject = ({ children, onProjectLoad }) => {
    const fileUpload = useFileUpload({
        maxFiles: MAX_ARCHIVE_FILES,
        maxFileSize: MAX_ARCHIVE_FILE_SIZE,
        validate: (file) => {
            const name = (file.name ?? "").toLowerCase();
            const ok = ACCEPT.some((ext) => name.endsWith(ext));
            return ok ? null : ["FILE_INVALID_TYPE"];
        },
        async onFileAccept(details) {
            const file = details.files[0];
            if (!file) return;

            try {
                const name = (file?.name ?? "").toLowerCase();
                if (name.endsWith(".tir-project")) {
                    const { project, files } = await parseProjectPackage(file);
                    onProjectLoad(project, file.name, files);
                } else {
                    const text = await file.text();
                    const json = JSON.parse(text);
                    onProjectLoad(json, file.name);
                }
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
            details.files.forEach((f) =>
                toaster.create({
                    type: "error",
                    title: f.file.name,
                    description: f.errors
                        .map((e) => errorMessages[e])
                        .join(", "),
                }),
            );
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
