import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersSuccessMutate } from "../../usersSuccessMutate";
import { usersErrorMutate } from "../../usersErrorMutate";
import { useEditStore } from "../../../user-edit-store";
import { changePassword } from "@/api/users";

export const usePasswordMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["edit-password"],
        mutationFn: changePassword,
        onSuccess: () => {
            usersSuccessMutate(queryClient, "PUT_PSWD_SUC");
            useEditStore.getState().setNewPassword("");
            useEditStore.getState().setPasswdOpen(false);
        },
        onError: (err) => {
            usersErrorMutate(err, queryClient, "PUT_PSWD_ERR");
        },
    });
};
