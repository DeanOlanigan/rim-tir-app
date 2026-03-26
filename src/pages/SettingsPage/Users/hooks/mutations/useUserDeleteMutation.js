import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersSuccessMutate } from "../../usersSuccessMutate";
import { usersErrorMutate } from "../../usersErrorMutate";
import { deleteUser } from "@/api/routes/users.api";

export const useUserDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-users"],
        mutationFn: deleteUser,
        onSuccess: () => usersSuccessMutate(queryClient, "DELETE_USER_SUC"),
        onError: (err) => usersErrorMutate(err, queryClient, "DELETE_ERR"),
    });
};
