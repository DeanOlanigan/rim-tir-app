import { Button, Menu, Portal } from "@chakra-ui/react";
import { downloadStateAsXml } from "@/utils/xml/storeToXml";
import { CreateConfigDialog } from "../Dialogs/CreateConfigDialog"; // ?
import { ConfigurationUploader } from "../ConfigurationUploader"; // ?
import { ConfInfoEdit } from "../Dialogs/ConfInfoEdit";
import { AreYouShureDialog } from "../Dialogs/AreYouShure";
import { useVariablesStore } from "@/store/variables-store";
import { useConfigInfoStore } from "@/store/config-info-store";
import { useValidationStore } from "@/store/validation-store";

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
                        <CreateConfigDialog>
                            <Menu.Item value="new-file" closeOnSelect={false}>
                                Создать...
                            </Menu.Item>
                        </CreateConfigDialog>
                        <ConfigurationUploader>
                            <Menu.Item value="new-txt" closeOnSelect={false}>
                                Открыть...
                            </Menu.Item>
                        </ConfigurationUploader>
                        <ConfInfoEdit>
                            <Menu.Item value="rename" closeOnSelect={false}>
                                Редактировать
                            </Menu.Item>
                        </ConfInfoEdit>
                        <Menu.Item value="new-win" onClick={downloadStateAsXml}>
                            Сохранить
                        </Menu.Item>
                        <AreYouShureDialog
                            onAccept={() => {
                                useVariablesStore.getState().resetState();
                                useConfigInfoStore.setState({
                                    configInfo: {},
                                });
                                useValidationStore.getState().clearErrors();
                            }}
                            header={"Закрыть конфигурацию?"}
                            message={"Все данные будут потеряны."}
                        >
                            <Menu.Item value="export" closeOnSelect={false}>
                                Закрыть
                            </Menu.Item>
                        </AreYouShureDialog>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
