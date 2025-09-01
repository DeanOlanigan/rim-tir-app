import { FileUpload } from "@chakra-ui/react";
import { uploadXmlFile } from "@/utils/xml/xmlToStore";
import { toaster } from "@/components/ui/toaster";

export const ConfigurationUploader = ({ children }) => {
    const acceptHandler = (details) => {
        console.log("accept", details);
        try {
            uploadXmlFile(details.files[0]);
        } catch (error) {
            toaster.create({
                title: "Произошла ошибка",
                description: error.message,
                type: "error",
            });
        }
        toaster.create({
            title: "Файл загружен",
            type: "success",
        });
    };
    const rejectHandler = (details) => {
        console.log("reject", details);
        toaster.create({
            title: "Файл не загружен",
            type: "error",
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
