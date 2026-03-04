import { apiv2 } from "@/api/baseUrl";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/queryClients";
import { rolesSuccessMutate } from "../../rolesSuccessMutate";
import { rolesErrorMutate } from "../../rolesErrorMutate";

export const useRolePutMutation = () => {
    return useMutation({
        mutationKey: ["role-put"],
        mutationFn: async (editedRole) => {
            const res = await apiv2.put("/editRoles", editedRole);
            return res;
        },
        onSuccess: () => rolesSuccessMutate(queryClient, "PUT_ROLE_SUC"),
        onError: (err) => rolesErrorMutate(err, queryClient, "PUT_ERR"),
    });
};
