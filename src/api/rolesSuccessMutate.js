import { QK } from "./queryKeys";
import { toaster } from "@/components/ui/toaster";
import { useRightsAndRolesStore } from "@/pages/SettingsPage/Settings/SettingsStore/rights-and-roles-store";

export function rolesSuccessMutate(queryClient, text) {
    queryClient.setQueryData([QK.roles], () => {
        return useRightsAndRolesStore.getState().roles;
    });
    toaster.create({
        type: "success",
        description: text,
        closable: true,
    });
}
