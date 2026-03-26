import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersSuccessMutate } from "../../usersSuccessMutate";
import { usersErrorMutate } from "../../usersErrorMutate";
import { createUser } from "@/api/routes/users.api";

export const useUserPostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["user-post"],
        mutationFn: createUser,
        onSuccess: () => usersSuccessMutate(queryClient, "POST_USER_SUC"),
        onError: (err) => usersErrorMutate(err, queryClient, "POST_ERR"),
    });
};
