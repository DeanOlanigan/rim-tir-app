import { apiv2 } from "@/api/baseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersSuccessMutate } from "../../usersSuccessMutate";
import { usersErrorMutate } from "../../usersErrorMutate";

export const useUsersPutMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["put-users"],
        mutationFn: async ({ ids, newData }) => {
            const res = await apiv2.put("/editUsers", {
                ids: ids,
                newData: newData,
            });
            return res;
        },
        onSuccess: () => usersSuccessMutate(queryClient, "PUT_USER_SUC"),
        onError: (err) => usersErrorMutate(err, queryClient, "PUT_ERR"),
    });
};
