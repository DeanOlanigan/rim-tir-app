import { toaster } from "@/components/ui/toaster";
import { useRightsAndRolesStore } from "@/pages/SettingsPage/Roles/store/rights-and-roles-store";
import { errors } from "../errors";

export function handleRoleAdd({ newRoleName, setNewName }) {
    if (!newRoleName) return;
    const newName = newRoleName;
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
    setNewName("");
    const newRole = {
        id: newId,
        name: newName,
        rights: [],
    };
    return newRole;
}
