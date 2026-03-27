import { Button, Menu, Portal } from "@chakra-ui/react";
import { useVariablesStore } from "@/store/variables-store";
import { useValidationStore } from "@/store/validation-store";
import {
    useRefreshConfigurationMutation,
    useUploadConfigurationMutation,
} from "@/hooks/useMutation";
import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";
import { CanAccess } from "@/CanAccess";

function buildConfigurationPayload(state) {
    return {
        info: state.info,
        settings: state.settings,
        variables: state.variables,
        receive: state.receive,
        send: state.send,
    };
}

export const RouterMenu = ({ ...props }) => {
    const errorsTreeSize = useValidationStore((state) => state.errorsTree.size);
    const sync = useVariablesStore((state) => state.sync);
    const hasErrors = errorsTreeSize > 0;

    const uploadM = useUploadConfigurationMutation();
    const refreshM = useRefreshConfigurationMutation();

    const sendConfigHandler = () => {
        if (hasErrors) return;
        const currentState = useVariablesStore.getState();
        const config = buildConfigurationPayload(currentState);
        uploadM.mutate({ config });
    };

    return (
        <Menu.Root size={"sm"}>
            <Menu.Trigger asChild>
                <Button variant="surface" size="2xs" {...props}>
                    Сервер
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <CanAccess right={"config.upload"}>
                            <Menu.Item
                                value="new-txt"
                                onClick={sendConfigHandler}
                                disabled={uploadM.isPending || hasErrors}
                            >
                                {uploadM.isPending
                                    ? "Отправка..."
                                    : "Отправить конфигурацию"}
                            </Menu.Item>
                        </CanAccess>
                        <Menu.Item
                            value="new-file"
                            disabled={refreshM.isPending || sync}
                            onClick={(e) => {
                                if (sync) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                } else {
                                    confirmDialog.open(CONFIRM_DIALOG_ID, {
                                        onAccept: () => refreshM.mutate(),
                                        title: "Получить конфигурацию?",
                                        message:
                                            "Получение конфигурации с сервера приведет к потере данных на этой странице.",
                                    });
                                }
                            }}
                        >
                            {refreshM.isPending
                                ? "Обновление..."
                                : "Получить конфигурацию"}
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
