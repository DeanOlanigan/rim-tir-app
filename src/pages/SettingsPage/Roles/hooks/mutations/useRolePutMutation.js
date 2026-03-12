import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/queryClients";
import { rolesSuccessMutate } from "../../rolesSuccessMutate";
import { rolesErrorMutate } from "../../rolesErrorMutate";
import { updateRole } from "@/api/roles";

export const useRolePutMutation = () => {
    return useMutation({
        mutationKey: ["role-put"],
        mutationFn: updateRole,
        onSuccess: () => rolesSuccessMutate(queryClient, "PUT_ROLE_SUC"),
        onError: (err) => rolesErrorMutate(err, queryClient, "PUT_ERR"),
    });
};
