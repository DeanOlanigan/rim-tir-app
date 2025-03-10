import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "../../../components/ui/menu";
import { Button } from "@chakra-ui/react";

export const ConfMenu = () => {
    return (
        <MenuRoot size={"md"}>
            <MenuTrigger asChild>
                <Button variant="ghost" size="2xs" rounded={"md"}>
                    Конфигурация
                </Button>
            </MenuTrigger>
            <MenuContent>
                <MenuItem value="new-file">Создать...</MenuItem>
                <MenuItem value="new-txt">Открыть...</MenuItem>
                <MenuItem value="new-win">Сохранить</MenuItem>
                <MenuItem value="open-file">Сохранить как...</MenuItem>
                <MenuItem value="export">Закрыть</MenuItem>
            </MenuContent>
        </MenuRoot>
    );
};
