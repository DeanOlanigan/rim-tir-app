import { toaster } from "@/components/ui/toaster";
import { useRightsAndRolesStore } from "@/pages/SettingsPage/Settings/SettingsStore/rights-and-roles-store";

const errors = {
    ROLE_ALREADY_EXISTS:
        "Ошибка добавления роли: Роль с таким именем уже существует",
    INVALID_ROLE_NAME:
        "В имени могут быть использованы только буквы латиницы и кириллицы, цифры, пробел и дефис",
};

export function handleRoleAdd(newRoleRef) {
    if (!newRoleRef.current.value) return;
    const newName = newRoleRef.current.value;
    let newId;
    try {
        newId = useRightsAndRolesStore.getState().addRole(newName);
    } catch (err) {
        toaster.create({
            type: "error",
            description: errors[err.message],
            closable: true,
        });
        return;
    }
    newRoleRef.current.value = "";
    const newRole = {
        id: newId,
        name: newName,
        rights: [],
    };
    return newRole;
}
