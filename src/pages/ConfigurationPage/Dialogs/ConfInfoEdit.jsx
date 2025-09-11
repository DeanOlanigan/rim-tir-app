import {
    Button,
    Text,
    Flex,
    Box,
    Field,
    Textarea,
    Dialog,
    Portal,
    CloseButton,
} from "@chakra-ui/react";
import { useConfigInfoStore } from "@/store/config-info-store";
import { useState } from "react";
import { ConfigurationNameInput } from "./ConfigurationNameInput";

export const ConfInfoEdit = ({ children }) => {
    const { name, description, date, version } = useConfigInfoStore(
        (state) => state.configInfo
    );

    const [isOpen, setIsOpen] = useState(false);
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
        setIsOpen(false);
    };

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(e) => setIsOpen(e.open)}
            placement={"center"}
        >
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size={"xs"} />
                        </Dialog.CloseTrigger>
                        <Dialog.Header>
                            <Dialog.Title>
                                Редактирование конфигурации
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Flex gap={"2"} direction={"column"}>
                                <Field.Root>
                                    <Field.Label>Имя конфигурации</Field.Label>
                                    <ConfigurationNameInput
                                        name={initialName}
                                        setName={setName}
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
                            </Flex>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button
                                w={"100%"}
                                size={"xs"}
                                disabled={!isNameValid}
                                onClick={saveHandler}
                            >
                                Сохранить
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
