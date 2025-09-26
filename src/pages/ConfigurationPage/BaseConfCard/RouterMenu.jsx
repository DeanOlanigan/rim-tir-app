import { Button, Menu, Portal } from "@chakra-ui/react";
import { convertStateToXml } from "@/utils/xml/storeToXml";
import { useVariablesStore } from "@/store/variables-store";
import { useConfigInfoStore } from "@/store/config-info-store";
import { useValidationStore } from "@/store/validation-store";
import {
    useRefreshConfigurationMutation,
    useRestartTirMutation,
    useStartTirMutation,
    useStopTirMutation,
    useUploadConfigurationMutation,
} from "@/hooks/useMutation";

export const RouterMenu = () => {
    const currentState = useVariablesStore.getState();
    const currentConfigInfo = useConfigInfoStore.getState().configInfo;

    const errorsTreeSize = useValidationStore((state) => state.errorsTree.size);
    const hasErrors = errorsTreeSize > 0;

    const startM = useStartTirMutation();
    const stopM = useStopTirMutation();
    const restartM = useRestartTirMutation();
    const uploadM = useUploadConfigurationMutation();
    const refreshM = useRefreshConfigurationMutation();

    const sendConfigHandler = () => {
        if (hasErrors) return;
        const xml = convertStateToXml(currentState, currentConfigInfo);
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
                        <Menu.Item
                            value="new-file"
                            onClick={getConfigHandler}
                            disabled={refreshM.isPending}
                        >
                            {refreshM.isPending
                                ? "Обновление..."
                                : "Обновить конфигурацию"}
                        </Menu.Item>
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
