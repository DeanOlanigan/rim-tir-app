import { FileUpload } from "@chakra-ui/react";
import { uploadXmlFile } from "../../utils/xmlToStore";
import { toaster } from "../../components/ui/toaster";

export const ConfigurationUploader = ({ children }) => {
    const acceptHandler = (details) => {
        console.log("accept", details);
        uploadXmlFile(details.files[0]);
        toaster.create({
            title: "Файл загружен",
            type: "success",
        });
    };
    const rejectHandler = (details) => {
        console.log("reject", details);
    };
    const changeHandler = (details) => {
        console.log("change", details);
    };

    return (
        <FileUpload.Root
            accept={[".xml"]}
            maxFiles={1}
            onFileAccept={acceptHandler}
            onFileReject={rejectHandler}
            onFileChange={changeHandler}
        >
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>{children}</FileUpload.Trigger>
        </FileUpload.Root>
    );
};
