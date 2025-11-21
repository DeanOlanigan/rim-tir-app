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
import { LuUpload } from "react-icons/lu";

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
                    {MAX_FILES - acceptedFiles.length} файл для
                    {MAX_FILES - acceptedFiles.length !== 1 ? "s" : ""} загрузки
                </Box>
            </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
    );
};

export const Updates = () => {
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
                        variant="subtle"
                        placeholder="Здесь будет виден процесс установки"
                        fontWeight={"500"}
                    />
                    <FileUpload.Root
                        paddingTop="3"
                        w="100%"
                        alignItems="stretch"
                        maxFiles={MAX_FILES}
                        accept={["exe"]}
                    >
                        <FileUpload.HiddenInput />
                        <ConditionalDropzone />
                        <FileUpload.List clearable />
                    </FileUpload.Root>
                </Card.Body>
                <Card.Footer>
                    <Button>Установить</Button>
                </Card.Footer>
            </Card.Root>
        </>
    );
};
