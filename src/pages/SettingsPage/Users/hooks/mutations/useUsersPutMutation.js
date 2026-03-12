import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersSuccessMutate } from "../../usersSuccessMutate";
import { usersErrorMutate } from "../../usersErrorMutate";
import { updateUsers } from "@/api/users";

export const useUsersPutMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["put-users"],
        mutationFn: updateUsers,
        onSuccess: () => usersSuccessMutate(queryClient, "PUT_USER_SUC"),
        onError: (err) => usersErrorMutate(err, queryClient, "PUT_ERR"),
    });
};
