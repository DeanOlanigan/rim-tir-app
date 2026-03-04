import { toaster } from "@/components/ui/toaster";
import axios from "axios";
import { QK } from "../../../api/queryKeys";
import { useTableStore } from "../tablestore";
import { CK } from "../crudKeys";

export function usersErrorMutate(err, queryClient, crudKey) {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status || err?.message;
        const code = err.response?.data?.error?.code || err?.code;
        if (status === 409) {
            toaster.create({
                description: `Ошибка при изменении пароля пользователей: Старый и новый пароли совпадают`,
                type: "error",
                closable: true,
            });
            useTableStore
                .getState()
                .hydrate(queryClient.getQueryData(QK.users));
            return;
        }
        toaster.create({
            description: `Ошибка при ${CK[crudKey]} пользователей: ${status} ${code}`,
            type: "error",
            closable: true,
        });
    } else {
        toaster.create({
            description: `Неизвестная ошибка при ${CK[crudKey]} пользователей`,
            type: "error",
            closable: true,
        });
    }
    useTableStore.getState().hydrate(queryClient.getQueryData(QK.users));
}
