import { Button, Menu, Portal } from "@chakra-ui/react";
import { convertStateToXml } from "@/utils/xml/storeToXml";
import { useVariablesStore } from "@/store/variables-store";
import { useValidationStore } from "@/store/validation-store";
import {
    useRefreshConfigurationMutation,
    useRestartTirMutation,
    useStartTirMutation,
    useStopTirMutation,
    useUploadConfigurationMutation,
} from "@/hooks/useMutation";
import { AreYouShureDialog } from "../Dialogs/AreYouShure";

export const RouterMenu = () => {
    const errorsTreeSize = useValidationStore((state) => state.errorsTree.size);
    const sync = useVariablesStore((state) => state.sync);
    const hasErrors = errorsTreeSize > 0;

    const startM = useStartTirMutation();
    const stopM = useStopTirMutation();
    const restartM = useRestartTirMutation();
    const uploadM = useUploadConfigurationMutation();
    const refreshM = useRefreshConfigurationMutation();

    const sendConfigHandler = () => {
        if (hasErrors) return;
        const currentState = useVariablesStore.getState();
        const xml = convertStateToXml(currentState);
        uploadM.mutate(xml);
    };

    const getConfigHandler = () => {
        refreshM.mutate();
    };

    return (
        <Menu.Root size={"sm"} closeOnSelect={false}>
            <Menu.Trigger asChild>
                <Button variant="surface" size="2xs">
                    Роутер
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item
                            value="new-txt"
                            onClick={sendConfigHandler}
                            disabled={uploadM.isPending || hasErrors}
                        >
                            {uploadM.isPending
                                ? "Отправка..."
                                : "Отправить конфигурацию"}
                        </Menu.Item>
                        <AreYouShureDialog
                            onAccept={getConfigHandler}
                            header={"Получить конфигурацию?"}
                            message={
                                "Получение конфигурации с сервера приведет к потере данных на этой странице."
                            }
                        >
                            <Menu.Item
                                value="new-file"
                                disabled={refreshM.isPending || sync}
                                onClick={(e) => {
                                    if (sync) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }
                                }}
                            >
                                {refreshM.isPending
                                    ? "Обновление..."
                                    : "Получить конфигурацию"}
                            </Menu.Item>
                        </AreYouShureDialog>
                        <Menu.Item
                            value="start"
                            onClick={() => startM.mutate()}
                            disabled={startM.isPending}
                        >
                            {startM.isPending
                                ? "Запуск..."
                                : "Запустить сервер"}
                        </Menu.Item>
                        <Menu.Item
                            value="stop"
                            onClick={() => stopM.mutate()}
                            disabled={stopM.isPending}
                        >
                            {stopM.isPending
                                ? "Остановка..."
                                : "Остановить сервер"}
                        </Menu.Item>
                        <Menu.Item
                            value="restart"
                            onClick={() => restartM.mutate()}
                            disabled={restartM.isPending}
                        >
                            {restartM.isPending
                                ? "Перезапуск..."
                                : "Перезапустить сервер"}
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
