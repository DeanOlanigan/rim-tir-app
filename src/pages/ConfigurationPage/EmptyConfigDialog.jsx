import {
    Dialog,
    Portal,
    Button,
    CloseButton,
    Text,
    Box,
} from "@chakra-ui/react";
import { useRef } from "react";
import { CreateConfigDialog } from "./CreateConfigDialog";
import { ConfigurationUploader } from "./ConfigurationUploader";
import { useConfigInfoStore } from "@/store/config-info-store";

export const EmptyConfigDialog = () => {
    const configInfo = useConfigInfoStore((state) => state.configInfo);
    const ref = useRef(null);
    const open = Object.keys(configInfo).length === 0;

    return (
        <Dialog.Root
            role="alertdialog"
            open={open}
            onOpenChange={(e) => {
                if (!e.open) {
                    useConfigInfoStore.setState({
                        configInfo: {
                            name: "Конфигурация без названия",
                            description: "",
                            date: new Date().toLocaleString("ru-RU", {}),
                            version: "1.0",
                        },
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
                            <Box w={"100%"}>
                                <ConfigurationUploader>
                                    <Button w={"100%"} size={"xs"}>
                                        Загрузить конфигурацию
                                    </Button>
                                </ConfigurationUploader>
                            </Box>
                            <Box w={"100%"}>
                                <CreateConfigDialog>
                                    <Button w={"100%"} size={"xs"} ref={ref}>
                                        Создать конфигурацию
                                    </Button>
                                </CreateConfigDialog>
                            </Box>
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
