import { apiv2 } from "@/api/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesErrorMutate } from "../../rolesErrorMutate";
import { rolesSuccessMutate } from "../../rolesSuccessMutate";

export const useRolePostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["role-post"],
        mutationFn: async (newRole) => {
            const res = await apiv2.post("roles", newRole, {
                headers: { "Content-Type": "application/json" },
                tittle: "New Role",
            });
            return res;
        },
        onSuccess: () => rolesSuccessMutate(queryClient, "POST_ROLE_SUC"),
        onError: (err) => rolesErrorMutate(err, queryClient, "POST_ERR"),
    });
};
