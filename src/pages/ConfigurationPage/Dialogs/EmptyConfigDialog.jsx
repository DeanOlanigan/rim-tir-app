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
import { ConfigurationUploader } from "../ConfigurationUploader";
import { useVariablesStore } from "@/store/variables-store";

export const EmptyConfigDialog = () => {
    const info = useVariablesStore((state) => state.info);
    const ref = useRef(null);

    return (
        <Dialog.Root
            role="alertdialog"
            open={!info.name}
            onOpenChange={(e) => {
                if (!e.open) {
                    useVariablesStore
                        .getState()
                        .updateInfo(
                            Date.now(),
                            "Конфигурация без названия",
                            "Конфигурация без описания"
                        );
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
