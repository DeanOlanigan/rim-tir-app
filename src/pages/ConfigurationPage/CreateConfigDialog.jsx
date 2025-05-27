import {
    Dialog,
    Portal,
    Button,
    VStack,
    Input,
    Textarea,
    CloseButton,
    Alert,
} from "@chakra-ui/react";
import { useState } from "react";
import { useConfigInfoStore } from "@/store/config-info-store";
import { useVariablesStore } from "@/store/variables-store";

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
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Новая конфигурация</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <VStack spacing={4} align="stretch">
                                {hasPreviousConfig && (
                                    <Alert.Root status={"warning"}>
                                        <Alert.Indicator />
                                        <Alert.Title>
                                            Сохраните предыдущую конфигурацию
                                        </Alert.Title>
                                    </Alert.Root>
                                )}
                                <Input
                                    placeholder="Имя конфигурации"
                                    value={name}
                                    maxLength={20}
                                    onChange={(e) => setName(e.target.value)}
                                    size="xs"
                                />
                                <Textarea
                                    resize={"none"}
                                    placeholder="Описание"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    size="xs"
                                />
                            </VStack>
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
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size={"xs"} />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
