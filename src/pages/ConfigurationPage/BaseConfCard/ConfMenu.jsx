import { Button, Menu, Portal } from "@chakra-ui/react";
import { downloadStateAsXml } from "@/utils/xml/storeToXml";
import { ConfigurationUploader } from "../ConfigurationUploader"; // ?
import {
    CONF_INFO_EDIT_DIALOG_ID,
    configurationInfoDialog,
    MODE,
} from "../Dialogs/configurationInfoDialog";
import { CanAccess } from "@/CanAccess";
import {
    useRefreshConfigurationMutation,
    useUploadConfigurationMutation,
} from "@/hooks/useMutation";
import { useVariablesStore } from "@/store/variables-store";
import { useValidationStore } from "@/store/validation-store";
import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";

function buildConfigurationPayload(state) {
    return {
        info: state.info,
        settings: state.settings,
        variables: state.variables,
        receive: state.receive,
        send: state.send,
    };
}

export const ConfMenu = ({ ...props }) => {
    const errorsTreeSize = useValidationStore((state) => state.errorsTree.size);
    const sync = useVariablesStore((state) => state.sync);
    const uploadM = useUploadConfigurationMutation();
    const refreshM = useRefreshConfigurationMutation();

    const hasErrors = errorsTreeSize > 0;

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
                    Конфигурация
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <CanAccess right={"config.upload"}>
                            <Menu.Item
                                value="send-config"
                                onClick={sendConfigHandler}
                                disabled={uploadM.isPending || hasErrors}
                            >
                                {uploadM.isPending
                                    ? "Отправка..."
                                    : "Отправить конфигурацию"}
                            </Menu.Item>
                        </CanAccess>
                        <Menu.Item
                            value="get-config"
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
                        <CanAccess right={"config.editor"}>
                            <Menu.Item
                                value="new-config"
                                onClick={() =>
                                    configurationInfoDialog.open(
                                        CONF_INFO_EDIT_DIALOG_ID,
                                        {
                                            mode: MODE.CREATE,
                                        },
                                    )
                                }
                            >
                                Создать...
                            </Menu.Item>
                        </CanAccess>
                        <CanAccess right={"config.open"}>
                            <ConfigurationUploader>
                                <Menu.Item value="open-config">
                                    Открыть...
                                </Menu.Item>
                            </ConfigurationUploader>
                        </CanAccess>
                        <CanAccess right={"config.editor"}>
                            <Menu.Item
                                value="edit-config"
                                onClick={() =>
                                    configurationInfoDialog.open(
                                        CONF_INFO_EDIT_DIALOG_ID,
                                        {
                                            mode: MODE.EDIT,
                                        },
                                    )
                                }
                            >
                                Редактировать
                            </Menu.Item>
                        </CanAccess>
                        <Menu.Item
                            value="save-config"
                            onClick={downloadStateAsXml}
                        >
                            Сохранить
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
