import { Dialog, Portal, Button, CloseButton, Text } from "@chakra-ui/react";
import { useVariablesStore } from "../../store/variables-store";
import { useState, useEffect, useRef } from "react";
import { CreateConfigDialog } from "./CreateConfigDialog";

export const EmptyConfigDialog = () => {
    const configurationInfo = useVariablesStore((state) => state.configInfo);
    const setConfigInfo = useVariablesStore((state) => state.setConfigInfo);

    const ref = useRef(null);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(Object.keys(configurationInfo).length === 0);
    }, [configurationInfo]);

    const loadConfigHandler = () => {
        console.log("loadConfigHandler");
    };

    return (
        <Dialog.Root
            role="alertdialog"
            open={open}
            onOpenChange={(e) => {
                setOpen(e.open);
                if (!e.open) {
                    setConfigInfo({
                        name: "Конфигурация без названия",
                        description: "",
                        date: new Date().toLocaleString("ru-RU", {}),
                        version: "1.0",
                    });
                }
            }}
            placement={"center"}
            initialFocusEl={() => ref.current}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Пусто</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Text>
                                Похоже, что в данный момент отсутствует
                                конфигурация
                            </Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button size={"xs"} onClick={loadConfigHandler}>
                                Загрузить конфигурацию
                            </Button>
                            <CreateConfigDialog>
                                <Button size={"xs"} ref={ref}>
                                    Создать конфигурацию
                                </Button>
                            </CreateConfigDialog>
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
