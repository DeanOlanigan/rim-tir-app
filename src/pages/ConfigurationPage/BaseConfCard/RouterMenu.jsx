import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "@/components/ui/menu";
import { Button } from "@chakra-ui/react";

export const RouterMenu = () => {
    return (
        <MenuRoot size={"md"}>
            <MenuTrigger asChild>
                <Button
                    variant="subtle"
                    size="2xs"
                    rounded={"md"}
                    shadow={"md"}
                >
                    Роутер
                </Button>
            </MenuTrigger>
            <MenuContent>
                <MenuItem value="new-txt">Отправить конфигурацию</MenuItem>
                <MenuItem value="new-file">Обновить конфигурацию</MenuItem>
                <MenuItem value="start">Запустить сервер</MenuItem>
                <MenuItem value="stop">Остановить сервер</MenuItem>
                <MenuItem value="restart">Перезапустить сервер</MenuItem>
            </MenuContent>
        </MenuRoot>
    );
};
