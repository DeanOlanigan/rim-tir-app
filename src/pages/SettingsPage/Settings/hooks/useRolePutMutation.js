import { apiv2 } from "@/api/baseUrl";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/queryClients";
import { rolesSuccessMutate } from "./MutationResults/rolesSuccessMutate";
import { rolesErrorMutate } from "./MutationResults/rolesErrorMutate";

export const useRolePutMutation = () => {
    return useMutation({
        mutationKey: ["role-put"],
        mutationFn: async (editedRole) => {
            const res = await apiv2.put("/editRoles", editedRole);
            return res;
        },
        onSuccess: () =>
            rolesSuccessMutate(queryClient, "Роль успешно изменена"),
        onError: (err) => rolesErrorMutate(err, "изменении"),
    });
};
