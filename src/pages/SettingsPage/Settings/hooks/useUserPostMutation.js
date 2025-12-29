import { apiv2 } from "@/api/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersSuccessMutate } from "@/api/usersSuccessMutate";
import { usersErrorMutate } from "@/api/usersErrorMutate";

export const useUserPostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["user-post"],
        mutationFn: async ({ newId, newUser }) => {
            const res = await apiv2.post(
                "/addUser",
                { id: newId, userData: newUser },
                {
                    headers: { "Content-Type": "application/json" },
                },
            );
            return res;
        },
        onSuccess: () =>
            usersSuccessMutate(queryClient, "Пользователь успешно создан"),
        onError: (err) => usersErrorMutate(err, queryClient, "удалении"),
    });
};
