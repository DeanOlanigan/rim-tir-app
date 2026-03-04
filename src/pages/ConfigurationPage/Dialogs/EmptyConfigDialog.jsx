import {
    Dialog,
    Portal,
    Button,
    CloseButton,
    Text,
    Group,
    Highlight,
} from "@chakra-ui/react";
import { useRef } from "react";
import { ConfigurationUploader } from "../ConfigurationUploader";
import { useVariablesStore } from "@/store/variables-store";
import { useRefreshConfigurationMutation } from "@/hooks/useMutation";
import {
    configurationInfoDialog,
    CONF_INFO_EDIT_DIALOG_ID,
    MODE,
} from "../Dialogs/configurationInfoDialog";
import { CanAccess } from "@/CanAccess";

export const EmptyConfigDialog = () => {
    const info = useVariablesStore((state) => state.info);

    const refreshM = useRefreshConfigurationMutation();
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
                            "Конфигурация без описания",
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
                            <Dialog.Title>
                                Похоже, что конфигурация отсутствует
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Text></Text>
                            <Text>
                                <Highlight
                                    query={[
                                        "загрузить",
                                        "синхронизирацию",
                                        "создать",
                                    ]}
                                    styles={{ fontWeight: "bold" }}
                                >
                                    Для работы с конфигурацией вы можете
                                    загрузить её с вашего устройства, выполнить
                                    синхронизирацию с сервером или создать
                                    новую.
                                </Highlight>
                            </Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Group grow>
                                <CanAccess right={"config.open"}>
                                    <ConfigurationUploader>
                                        <Button size={"xs"}>
                                            Загрузить конфигурацию
                                        </Button>
                                    </ConfigurationUploader>
                                </CanAccess>
                                <Button
                                    size={"xs"}
                                    onClick={() => refreshM.mutate()}
                                >
                                    Синхронизировать
                                </Button>
                                <CanAccess right={"config.create"}>
                                    <Button
                                        size={"xs"}
                                        ref={ref}
                                        onClick={() =>
                                            configurationInfoDialog.open(
                                                CONF_INFO_EDIT_DIALOG_ID,
                                                { mode: MODE.CREATE },
                                            )
                                        }
                                    >
                                        Создать конфигурацию
                                    </Button>
                                </CanAccess>
                            </Group>
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
