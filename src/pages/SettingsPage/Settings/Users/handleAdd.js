import { toaster } from "@/components/ui/toaster";
import { useTableStore } from "../SettingsStore/tablestore";
import { useUserStore } from "../SettingsStore/user-add-store";

const errors = {
    EMPTY_FIELDS: "Все поля должны быть заполнены",
    NOT_CYRILLIC_SYMBOLS:
        "ФИО должно состоять только из кириллицы, Должность не должна включать в себя спец.символы",
    NOT_UNIQUE_LOGIN: "Пользователь с таким логином уже существует",
    INCORRECT_LOGIN: "Некорректный логин нового пользователя",
};

export function handleAdd(newId, newUser, scrollToBottom) {
    const addUser = useTableStore.getState().addUser;
    const cleanUser = useUserStore.getState().cleanUser;
    try {
        addUser(newId, newUser);
    } catch (error) {
        toaster.create({
            type: "error",
            description: `Ошибка добавления пользователя: ${errors[error.message]}`,
            closable: true,
        });
        return false;
    }
    cleanUser();
    setTimeout(() => scrollToBottom(), 0);
    return true;
}
