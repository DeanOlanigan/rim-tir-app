import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersSuccessMutate } from "../../usersSuccessMutate";
import { usersErrorMutate } from "../../usersErrorMutate";
import { deleteUsers } from "@/api/users";

export const useUserDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-users"],
        mutationFn: deleteUsers,
        onSuccess: () => usersSuccessMutate(queryClient, "DELETE_USER_SUC"),
        onError: (err) => usersErrorMutate(err, queryClient, "DELETE_ERR"),
    });
};
