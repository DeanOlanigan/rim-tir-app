import { Button, Menu, Portal } from "@chakra-ui/react";
import { downloadStateAsXml } from "@/utils/xml/storeToXml";
import { ConfigurationUploader } from "../ConfigurationUploader"; // ?
import {
    CONF_INFO_EDIT_DIALOG_ID,
    configurationInfoDialog,
    MODE,
} from "../Dialogs/configurationInfoDialog";
import { useVariablesStore } from "@/store/variables-store";
import { useValidationStore } from "@/store/validation-store";
import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";
import { CanAccess } from "@/CanAccess";

export const ConfMenu = () => {
    return (
        <Menu.Root size={"sm"}>
            <Menu.Trigger asChild>
                <Button variant="surface" size="2xs">
                    Конфигурация
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <CanAccess right={"config.create"}>
                            <Menu.Item
                                value="new-file"
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
                                <Menu.Item value="new-txt">
                                    Открыть...
                                </Menu.Item>
                            </ConfigurationUploader>
                        </CanAccess>
                        <CanAccess right={"config.edit"}>
                            <Menu.Item
                                value="rename"
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
                        <Menu.Item value="new-win" onClick={downloadStateAsXml}>
                            Сохранить
                        </Menu.Item>
                        <Menu.Item
                            value="export"
                            onClick={() =>
                                confirmDialog.open(CONFIRM_DIALOG_ID, {
                                    onAccept: () => {
                                        useVariablesStore
                                            .getState()
                                            .resetState();
                                        useValidationStore
                                            .getState()
                                            .clearErrors();
                                    },
                                    title: "Закрыть конфигурацию?",
                                    message: "Все данные будут потеряны.",
                                })
                            }
                        >
                            Закрыть
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
