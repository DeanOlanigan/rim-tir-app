import { FileUpload } from "@chakra-ui/react";
import { applyImport, uploadXmlFile } from "@/utils/xml/xmlToStore";
import { toaster } from "@/components/ui/toaster";

export const ConfigurationUploader = ({ children }) => {
    const acceptHandler = async (details) => {
        try {
            const result = await uploadXmlFile(details.files[0]);
            applyImport(result);
            toaster.create({
                title: "Файл загружен",
                type: "success",
            });
        } catch (error) {
            toaster.create({
                title: "Произошла ошибка",
                description: error?.message ?? "Неизвестная ошибка",
                type: "error",
            });
        }
    };
    const rejectHandler = (details) => {
        const errs = details?.files?.flatMap((f) => f.errors || []) ?? [];
        toaster.create({
            title: "Файл не загружен",
            type: "error",
            description: errs.join(", ") || "Неизвестная ошибка",
        });
    };

    return (
        <FileUpload.Root
            accept={[".xml"]}
            maxFiles={1}
            onFileAccept={acceptHandler}
            onFileReject={rejectHandler}
        >
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>{children}</FileUpload.Trigger>
        </FileUpload.Root>
    );
};
