import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@chakra-ui/react";
import { downloadStateAsXml } from "@/utils/xml/storeToXml";
import { useVariablesStore } from "@/store/variables-store";
import { CreateConfigDialog } from "../Dialogs/CreateConfigDialog"; // ?
import { ConfigurationUploader } from "../ConfigurationUploader"; // ?
import { ConfInfoEdit } from "../Dialogs/ConfInfoEdit";
import { useConfigInfoStore } from "@/store/config-info-store";
import { useValidationStore } from "@/store/validation-store";

export const ConfMenu = () => {
    const resetState = useVariablesStore((state) => state.resetState);

    const closeHandler = () => {
        resetState();
        useConfigInfoStore.setState({
            configInfo: {},
        });
        useValidationStore.getState().clearErrors();
    };

    return (
        <MenuRoot size={"sm"}>
            <MenuTrigger asChild>
                <Button variant="surface" size="2xs">
                    Конфигурация
                </Button>
            </MenuTrigger>
            <MenuContent>
                <CreateConfigDialog>
                    <MenuItem value="new-file" closeOnSelect={false}>
                        Создать...
                    </MenuItem>
                </CreateConfigDialog>
                <ConfigurationUploader>
                    <MenuItem value="new-txt" closeOnSelect={false}>
                        Открыть...
                    </MenuItem>
                </ConfigurationUploader>
                <ConfInfoEdit>
                    <MenuItem value="rename" closeOnSelect={false}>
                        Редактировать
                    </MenuItem>
                </ConfInfoEdit>
                <MenuItem value="new-win" onClick={downloadStateAsXml}>
                    Сохранить
                </MenuItem>
                <MenuItem value="export" onClick={closeHandler}>
                    Закрыть
                </MenuItem>
            </MenuContent>
        </MenuRoot>
    );
};
