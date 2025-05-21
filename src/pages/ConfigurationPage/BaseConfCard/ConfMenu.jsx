import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@chakra-ui/react";
import { downloadStateAsXml } from "@/utils/storeToXml";
import { useVariablesStore } from "@/store/variables-store";
import { CreateConfigDialog } from "../CreateConfigDialog"; // ?
import { ConfigurationUploader } from "../ConfigurationUploader"; // ?

export const ConfMenu = () => {
    const resetState = useVariablesStore((state) => state.resetState);

    const closeHandler = () => {
        resetState();
    };

    return (
        <MenuRoot size={"md"}>
            <MenuTrigger asChild>
                <Button variant="subtle" size="2xs" rounded={"md"}>
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
