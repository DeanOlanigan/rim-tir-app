import { apiv2 } from "@/api/baseUrl";
import {
    Box,
    Button,
    Card,
    FileUpload,
    Heading,
    Icon,
    Text,
    Textarea,
    useFileUploadContext,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LuUpload } from "react-icons/lu";

const MAX_FILES = 1;

const useUpdatesLogs = (enabled) => {
    return useQuery({
        queryKey: ["update"],
        queryFn: async () => {
            const res = await apiv2.get("/checkUpdate");
            return res.data;
        },
        refetchInterval: 5000,
        enabled,
    });
};

const ConditionalDropzone = ({ setDownloader }) => {
    const fileUpload = useFileUploadContext();
    const acceptedFiles = fileUpload.acceptedFiles;

    useEffect(() => {
        setDownloader(acceptedFiles);
    }, [acceptedFiles]);

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
                    {MAX_FILES - acceptedFiles.length} файл для
                    {MAX_FILES - acceptedFiles.length !== 1 ? "s" : ""} загрузки
                </Box>
            </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
    );
};

export const Updates = () => {
    const [downloaderFile, setDownloader] = useState();
    const [isDown, setDown] = useState(false);
    const [logs, setLogs] = useState([]);

    const sendFileMutation = useMutation({
        mutationKey: ["senderFile"],
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("downloader", downloaderFile[0]);
            return apiv2
                .post("/getUpdate", formData)
                .then((res) => console.log(res))
                .catch((err) => {
                    throw err;
                });
        },
        onSuccess: () => {
            setDown(!isDown);
            setDownloader();
            setLogs([]);
        },
        onError: (err) => {
            const status =
                err?.response?.status || err?.message || "NO CONNECTION";
            const code =
                err?.response?.data?.error?.code ||
                err?.response?.data?.error ||
                err?.code ||
                "NO CONNECTION";
            setLogs([
                "Ошибка при установке обновления: " + `${status} ${code}`,
            ]);
            setDown(false);
        },
    });

    const { data } = useUpdatesLogs(isDown);

    useEffect(() => {
        if (data?.message) {
            setLogs((prev) => [
                ...prev.concat(data.message + data.progress + "%"),
            ]);
            if (data.progress === 100) {
                setLogs(["Обновление установлено!!!"]);
                setDown(false);
                setDownloader();
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
                    <FileUpload.Root
                        paddingTop="3"
                        w="100%"
                        alignItems="stretch"
                        maxFiles={MAX_FILES}
                        accept={[".ipk"]}
                    >
                        <FileUpload.HiddenInput />
                        <ConditionalDropzone setDownloader={setDownloader} />
                        <FileUpload.List clearable />
                    </FileUpload.Root>
                </Card.Body>
                <Card.Footer>
                    <Button
                        disabled={!downloaderFile?.length > 0}
                        loading={isDown}
                        loadingText={"Установка обновления"}
                        onClick={() => sendFileMutation.mutate()}
                    >
                        {downloaderFile?.length > 0
                            ? "Установить"
                            : "Загрузите установочный файл"}
                    </Button>
                </Card.Footer>
            </Card.Root>
        </>
    );
};
