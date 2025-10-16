import {
    Dialog,
    Portal,
    Button,
    Textarea,
    CloseButton,
    Alert,
    Flex,
    Field,
} from "@chakra-ui/react";
import { useState } from "react";
import { useConfigInfoStore } from "@/store/config-info-store";
import { useVariablesStore } from "@/store/variables-store";
import { useValidationStore } from "@/store/validation-store";
import { ConfigurationNameInput } from "./ConfigurationNameInput";

export const CreateConfigDialog = ({ children }) => {
    const configInfo = useConfigInfoStore((state) => state.configInfo);
    const resetState = useVariablesStore((state) => state.resetState);
    const [isOpen, setIsOpen] = useState(false);
    const [hasPreviousConfig, setHasPreviousConfig] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const isNameValid = name?.trim().length > 3;

    const submitCreateConfig = () => {
        resetState();
        useConfigInfoStore.setState({
            configInfo: {
                name,
                description,
                date: new Date().toLocaleString("ru-RU", {}),
                version: "1.0",
            },
        });
        useValidationStore.getState().clearErrors();
        setIsOpen(false);
    };

    return (
        <Dialog.Root
            placement={"center"}
            open={isOpen}
            onOpenChange={(e) => {
                setIsOpen(e.open);
                if (e.open) {
                    setHasPreviousConfig(Boolean(configInfo?.name));
                } else {
                    setName("");
                    setDescription("");
                    setHasPreviousConfig(false);
                }
            }}
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
                            <Dialog.Title>Новая конфигурация</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Flex gap={"2"} direction={"column"}>
                                {hasPreviousConfig && (
                                    <Alert.Root status={"warning"}>
                                        <Alert.Indicator />
                                        <Alert.Title>
                                            Сохраните предыдущую конфигурацию
                                        </Alert.Title>
                                    </Alert.Root>
                                )}
                                <Field.Root>
                                    <Field.Label>Имя конфигурации</Field.Label>
                                    <ConfigurationNameInput
                                        name={name}
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
                                        value={description}
                                        placeholder="Описание"
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    />
                                </Field.Root>
                            </Flex>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="ghost" size="xs">
                                    Отмена
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                size="xs"
                                onClick={submitCreateConfig}
                                disabled={!isNameValid}
                            >
                                Создать
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
