import {
    Dialog,
    Portal,
    Button,
    VStack,
    Input,
    Textarea,
    CloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { useVariablesStore } from "../../store/variables-store";

export const CreateConfigDialog = ({ children }) => {
    const setConfigInfo = useVariablesStore((state) => state.setConfigInfo);
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const submitCreateConfig = () => {
        console.log("submitCreateConfig");
        setConfigInfo({
            name,
            description,
            date: new Date().toLocaleString("ru-RU", {}),
            version: "1.0",
        });
        setIsOpen(false);
    };

    const cancelCreateConfig = () => {
        setName("");
        setDescription("");
        setIsOpen(false);
    };

    return (
        <Dialog.Root
            placement={"center"}
            open={isOpen}
            onOpenChange={(e) => {
                console.log("onOpenChange");
                setIsOpen(e.open);
                if (!e.open) {
                    setName("");
                    setDescription("");
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
                            <Button
                                variant="ghost"
                                size="xs"
                                onClick={cancelCreateConfig}
                            >
                                Отмена
                            </Button>
                            <Button
                                size="xs"
                                onClick={submitCreateConfig}
                                disabled={!name.trim()}
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
