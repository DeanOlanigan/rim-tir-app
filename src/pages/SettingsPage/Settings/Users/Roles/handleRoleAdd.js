import { toaster } from "@/components/ui/toaster";
import { useRightsAndRolesStore } from "@/pages/SettingsPage/Settings/SettingsStore/rights-and-roles-store";
import { errors } from "../errors";

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
