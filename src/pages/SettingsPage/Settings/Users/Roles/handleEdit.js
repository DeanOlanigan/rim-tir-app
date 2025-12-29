import { toaster } from "@/components/ui/toaster";
import { useRightsAndRolesStore } from "../../SettingsStore/rights-and-roles-store";

const errors = {
    NO_SELECTED: "Выберите роль",
    EMPTY_NAME: "Имя не может быть пустым",
    ROLE_ALREADY_EXISTS: "Роль с таким именем уже существует",
    INVALID_ROLE_NAME:
        "В имени могут быть использованы только буквы латиницы и кириллицы, цифры, пробел и дефис",
};

export function handleEdit() {
    try {
        useRightsAndRolesStore.getState().editRole();
    } catch (err) {
        toaster.create({
            type: "error",
            description: `Ошибка редактирования роли: ${errors[err.message]}`,
            closable: true,
        });
        return false;
    }
    return true;
}
