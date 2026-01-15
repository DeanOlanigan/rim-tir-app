import { toaster } from "@/components/ui/toaster";
import { useRightsAndRolesStore } from "../../SettingsStore/rights-and-roles-store";
import { errors } from "../errors";

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
