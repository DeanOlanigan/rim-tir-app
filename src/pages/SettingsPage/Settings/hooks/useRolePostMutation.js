import { apiv2 } from "@/api/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesSuccessMutate } from "@/api/rolesSuccessMutate";
import { rolesErrorMutate } from "@/api/rolesErrorMutate";

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
        onSuccess: () =>
            rolesSuccessMutate(queryClient, "Роль успешно добавлена"),
        onError: (err) => rolesErrorMutate(err, "добавлении"),
    });
};
