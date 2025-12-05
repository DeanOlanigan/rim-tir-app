import {
    Box,
    Button,
    Card,
    FileUpload,
    Heading,
    Icon,
    Text,
    Textarea,
    useFileUpload,
    useFileUploadContext,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuUpload } from "react-icons/lu";
import { useUpdateMutation } from "./hooks/useUpdateMutation";
import { useUpdatesLogs } from "./hooks/useUpdateLogs";

const MAX_FILES = 1;

const ConditionalDropzone = () => {
    const fileUpload = useFileUploadContext();
    const acceptedFiles = fileUpload.acceptedFiles;

    if (acceptedFiles.length >= MAX_FILES) {
        return null;
    }

    return (
        <FileUpload.Dropzone>
            <Icon size="md" color="fg.muted">
                <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
                <Box>
                    Перетащите файл обновления сюда или кликните по этой области
                </Box>
                <Box color="fg.muted">
                    {MAX_FILES - acceptedFiles.length} файл формата
                    &quot;.ipk&quot; для загрузки
                </Box>
            </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
    );
};

export const Updates = () => {
    const [isDown, setDown] = useState(false);
    const [logs, setLogs] = useState([]);
    const fileUpload = useFileUpload({
        accept: ".ipk",
    });

    const sendFileMutation = useUpdateMutation(
        setDown,
        setLogs,
        isDown,
        fileUpload
    );

    const { data } = useUpdatesLogs(isDown);

    useEffect(() => {
        if (data?.message) {
            setLogs((prev) => [
                ...prev.concat(data.message + data.progress + "%"),
            ]);
            if (data.progress === 100) {
                setLogs(["Обновление установлено!!!"]);
                setDown(false);
                fileUpload.clearFiles();
            }
        }
    }, [data]);

    return (
        <>
            <Heading paddingBottom={"2"}>Обновления </Heading>
            <Card.Root variant={"elevated"}>
                <Card.Header>
                    <Text fontSize={"lg"} fontWeight="medium">
                        Установка обновлений
                    </Text>
                </Card.Header>
                <Card.Body>
                    <Textarea
                        value={logs.join("\n") || ""}
                        variant="subtle"
                        readOnly
                        placeholder="Здесь будет виден процесс установки"
                        fontWeight={"500"}
                        autoresize
                        maxH="xl"
                    />
                    <FileUpload.RootProvider
                        value={fileUpload}
                        paddingTop="3"
                        w="100%"
                        alignItems="stretch"
                    >
                        <FileUpload.HiddenInput />
                        <ConditionalDropzone />
                        <FileUpload.List clearable />
                    </FileUpload.RootProvider>
                </Card.Body>
                <Card.Footer>
                    <Button
                        disabled={fileUpload?.acceptedFiles.length === 0}
                        loading={isDown}
                        loadingText={"Установка обновления"}
                        onClick={() => sendFileMutation.mutate()}
                    >
                        {fileUpload.acceptedFiles.length > 0
                            ? "Установить"
                            : "Загрузите установочный файл"}
                    </Button>
                </Card.Footer>
            </Card.Root>
        </>
    );
};
