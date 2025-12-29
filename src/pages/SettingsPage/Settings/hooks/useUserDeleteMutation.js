import { apiv2 } from "@/api/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersErrorMutate } from "@/api/usersErrorMutate";
import { usersSuccessMutate } from "@/api/usersSuccessMutate";

export const useUserDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-users"],
        mutationFn: async (ids) => {
            const idsQuery = ids.join(",");
            const res = await apiv2.delete(`/deleteUsers?ids=${idsQuery}`);
            return res;
        },
        onSuccess: () =>
            usersSuccessMutate(queryClient, "Удаление прошло успешно"),
        onError: (err) => usersErrorMutate(err, queryClient, "удалении"),
    });
};
