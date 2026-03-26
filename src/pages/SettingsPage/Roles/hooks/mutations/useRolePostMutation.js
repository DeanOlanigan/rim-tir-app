import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesErrorMutate } from "../../rolesErrorMutate";
import { rolesSuccessMutate } from "../../rolesSuccessMutate";
import { createRole } from "@/api/routes/roles.api";

export const useRolePostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["role-post"],
        mutationFn: createRole,
        onSuccess: () => rolesSuccessMutate(queryClient, "POST_ROLE_SUC"),
        onError: (err) => rolesErrorMutate(err, queryClient, "POST_ERR"),
    });
};
