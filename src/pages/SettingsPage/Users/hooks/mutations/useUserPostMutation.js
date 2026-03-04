import { apiv2 } from "@/api/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersSuccessMutate } from "../../usersSuccessMutate";
import { usersErrorMutate } from "../../usersErrorMutate";

export const useUserPostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["user-post"],
        mutationFn: async ({ newId, newUser, password }) => {
            const res = await apiv2.post(
                "/addUser",
                { id: newId, userData: { ...newUser, password: password } },
                {
                    headers: { "Content-Type": "application/json" },
                },
            );
            return res;
        },
        onSuccess: () => usersSuccessMutate(queryClient, "POST_USER_SUC"),
        onError: (err) => usersErrorMutate(err, queryClient, "POST_ERR"),
    });
};
