import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersSuccessMutate } from "../../usersSuccessMutate";
import { usersErrorMutate } from "../../usersErrorMutate";
import { updateUser } from "@/api/routes/users.api";

export const useUsersPutMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["put-users"],
        mutationFn: updateUser,
        onSuccess: () => usersSuccessMutate(queryClient, "PUT_USER_SUC"),
        onError: (err) => usersErrorMutate(err, queryClient, "PUT_ERR"),
    });
};
