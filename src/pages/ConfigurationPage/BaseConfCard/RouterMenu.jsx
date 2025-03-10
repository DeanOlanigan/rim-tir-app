import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "../../../components/ui/menu";
import { Button } from "@chakra-ui/react";

export const RouterMenu = () => {
    return (
        <MenuRoot size={"md"}>
            <MenuTrigger asChild>
                <Button variant="ghost" size="2xs" rounded={"md"}>
                    Роутер
                </Button>
            </MenuTrigger>
            <MenuContent>
                <MenuItem value="new-txt">Отправить конфигурацию</MenuItem>
                <MenuItem value="new-file">Обновить конфигурацию</MenuItem>
            </MenuContent>
        </MenuRoot>
    );
};
