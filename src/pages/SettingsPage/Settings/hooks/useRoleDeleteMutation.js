import { apiv2 } from "@/api/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesSuccessMutate } from "./MutationResults/rolesSuccessMutate";
import { rolesErrorMutate } from "./MutationResults/rolesErrorMutate";

export const useRoleDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-role"],
        mutationFn: async (id) => {
            const res = await apiv2.delete(`roles/${id}`);
            return res;
        },
        onSuccess: () =>
            rolesSuccessMutate(queryClient, "Роль успешно удалена"),
        onError: (err) => rolesErrorMutate(err, "удалении"),
    });
};
