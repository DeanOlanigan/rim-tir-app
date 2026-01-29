import { apiv2 } from "@/api/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersSuccessMutate } from "./MutationResults/usersSuccessMutate";
import { usersErrorMutate } from "./MutationResults/usersErrorMutate";

export const useUserDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-users"],
        mutationFn: async (ids) => {
            const idsQuery = ids.join(",");
            const res = await apiv2.delete(`/deleteUsers?ids=${idsQuery}`);
            return res;
        },
        onSuccess: () => usersSuccessMutate(queryClient, "DELETE_USER_SUC"),
        onError: (err) => usersErrorMutate(err, queryClient, "DELETE_USER_ERR"),
    });
};
