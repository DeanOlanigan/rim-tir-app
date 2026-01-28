import { QK } from "../../../../../api/queryKeys";
import { toaster } from "@/components/ui/toaster";
import { useRightsAndRolesStore } from "../../SettingsStore/rights-and-roles-store";
import { CK } from "./crudKeys";

export function rolesSuccessMutate(queryClient, crudKey) {
    queryClient.setQueryData(QK.roles, () => {
        return useRightsAndRolesStore.getState().roles;
    });
    toaster.create({
        type: "success",
        description: CK[crudKey],
        closable: true,
    });
}
