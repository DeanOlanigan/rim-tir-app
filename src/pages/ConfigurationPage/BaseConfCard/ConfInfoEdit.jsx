import {
    Button,
    Text,
    Flex,
    Box,
    Field,
    Input,
    Textarea,
    Dialog,
    Portal,
} from "@chakra-ui/react";
import { useConfigInfoStore } from "@/store/config-info-store";
import { useState } from "react";

export const ConfInfoEdit = ({ children }) => {
    const { name, description, date, version } = useConfigInfoStore(
        (state) => state.configInfo
    );

    const [initialName, setName] = useState(name ?? "");
    const [initialDescription, setDescription] = useState(description ?? "");

    const isNameValid = initialName?.trim().length > 3;

    const saveHandler = () => {
        useConfigInfoStore.setState({
            configInfo: {
                name: initialName,
                description: initialDescription,
                date: new Date().toLocaleString("ru-RU", {}),
                version: "1.0.0",
            },
        });
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Редактирование конфигурации
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Flex gap={"2"} direction={"column"}>
                                <Field.Root>
                                    <Field.Label>Название</Field.Label>
                                    <Input
                                        size={"xs"}
                                        value={initialName}
                                        maxLength={20}
                                        autoComplete={"off"}
                                        onChange={(e) => {
                                            setName(e.currentTarget.value);
                                        }}
                                    />
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>Описание</Field.Label>
                                    <Textarea
                                        resize={"none"}
                                        rows={5}
                                        size={"xs"}
                                        value={initialDescription}
                                        placeholder="Описание"
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                        }}
                                    />
                                </Field.Root>
                                <Flex justify={"space-between"}>
                                    <Box>
                                        <Text
                                            fontSize={"sm"}
                                            color={"fg.muted"}
                                        >
                                            Дата изменения:
                                        </Text>
                                        <Text fontSize={"md"}>{date}</Text>
                                    </Box>
                                    <Box>
                                        <Text
                                            fontSize={"sm"}
                                            color={"fg.muted"}
                                        >
                                            Версия:
                                        </Text>
                                        <Text fontSize={"md"}>{version}</Text>
                                    </Box>
                                </Flex>
                                <Button
                                    w={"100%"}
                                    size={"xs"}
                                    disabled={!isNameValid}
                                    onClick={saveHandler}
                                >
                                    Сохранить
                                </Button>
                            </Flex>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
