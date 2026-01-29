import { apiv2 } from "@/api/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersSuccessMutate } from "./MutationResults/usersSuccessMutate";
import { usersErrorMutate } from "./MutationResults/usersErrorMutate";
import { useEditStore } from "../SettingsStore/user-edit-store";

export const usePasswordMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["edit-password"],
        mutationFn: async ({ userId, editedPassword }) => {
            const res = await apiv2.put(
                "/chngPsswd",
                {
                    userId: userId,
                    editedPassword: editedPassword,
                },
                {
                    headers: { "Content-Type": "application/json" },
                },
            );
            return res;
        },
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
