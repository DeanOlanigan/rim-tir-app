import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesSuccessMutate } from "../../rolesSuccessMutate";
import { rolesErrorMutate } from "../../rolesErrorMutate";
import { deleteRole } from "@/api/roles";

export const useRoleDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-role"],
        mutationFn: deleteRole,
        onSuccess: () => rolesSuccessMutate(queryClient, "DELETE_ROLE_SUC"),
        onError: (err) => rolesErrorMutate(err, queryClient, "DELETE_ERR"),
    });
};
