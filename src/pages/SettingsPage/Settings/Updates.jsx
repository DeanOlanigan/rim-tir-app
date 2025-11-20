import {
    Card,
    FileUpload,
    Heading,
    IconButton,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";

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
                    />
                    <FileUpload.Root paddingTop="3">
                        <FileUpload.HiddenInput />
                        <FileUpload.Trigger asChild>
                            <IconButton variant={"ghost"} size={"sm"}>
                                <LuUpload /> Загрузите файл обновления
                            </IconButton>
                        </FileUpload.Trigger>
                    </FileUpload.Root>
                </Card.Body>
            </Card.Root>
        </>
    );
};
