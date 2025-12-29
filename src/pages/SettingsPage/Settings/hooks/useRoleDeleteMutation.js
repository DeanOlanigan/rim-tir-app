import { apiv2 } from "@/api/baseUrl";
import { rolesErrorMutate } from "@/api/rolesErrorMutate";
import { rolesSuccessMutate } from "@/api/rolesSuccessMutate";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRoleDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-role"],
        mutationFn: async (id) => {
            console.log(id);
            const res = await apiv2.delete(`roles/${id}`);
            return res;
        },
        onSuccess: () =>
            rolesSuccessMutate(queryClient, "Роль успешно удалена"),
        onError: (err) => rolesErrorMutate(err, "удалении"),
    });
};
