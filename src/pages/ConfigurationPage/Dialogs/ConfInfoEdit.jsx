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
import { useState } from "react";
import { ConfigurationNameInput } from "./ConfigurationNameInput";
import { useVariablesStore } from "@/store/variables-store";

// TODO Использовать человеческие способы обработки форм: zod, react-hook-form
export const ConfInfoEdit = ({ children }) => {
    const info = useVariablesStore((state) => state.info);

    const [isOpen, setIsOpen] = useState(false);
    const [initialName, setName] = useState(info.name ?? "");
    const [initialDescription, setDescription] = useState(
        info.description ?? "",
    );

    const isNameValid = initialName?.trim().length > 3;

    const saveHandler = () => {
        useVariablesStore
            .getState()
            .updateInfo(Date.now(), initialName, initialDescription);
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
                                    <Field.HelperText>
                                        Минимум 4 символа
                                    </Field.HelperText>
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
                                        <Text fontSize={"md"}>
                                            {new Date(
                                                parseInt(info.ts),
                                            ).toLocaleString()}
                                        </Text>
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
