import { toaster } from "@/components/ui/toaster";
import { useTableStore } from "../SettingsStore/tablestore";
import { useUserStore } from "../SettingsStore/user-add-store";
import { errors } from "./errors";
import { validatePassword } from "./validatePassword";

export function handleAdd(newId, newUser, password, scrollToBottom) {
    const addUser = useTableStore.getState().addUser;
    const cleanUser = useUserStore.getState().cleanUser;
    const { isValid, errorsArr } = validatePassword(password);
    if (!isValid) {
        toaster.create({
            type: "error",
            description: `Некорректный пароль: ${errorsArr.join(", ")}`,
        });
        return;
    }
    try {
        addUser(newId, newUser, password);
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
