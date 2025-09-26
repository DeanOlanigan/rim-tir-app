import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@chakra-ui/react";
import { downloadStateAsXml } from "@/utils/xml/storeToXml";
import { CreateConfigDialog } from "../Dialogs/CreateConfigDialog"; // ?
import { ConfigurationUploader } from "../ConfigurationUploader"; // ?
import { ConfInfoEdit } from "../Dialogs/ConfInfoEdit";
import { AreYouShureDialog } from "../Dialogs/AreYouShure";

export const ConfMenu = () => {
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
                <AreYouShureDialog>
                    <MenuItem value="export" closeOnSelect={false}>
                        Закрыть
                    </MenuItem>
                </AreYouShureDialog>
            </MenuContent>
        </MenuRoot>
    );
};
