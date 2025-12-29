import { toaster } from "@/components/ui/toaster";
import { useTableStore } from "@/pages/SettingsPage/Settings/SettingsStore/tablestore";
import axios from "axios";
import { QK } from "./queryKeys";

export function usersErrorMutate(err, queryClient, text) {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status || err?.message;
        const code = err.response?.data?.error?.code || err?.code;
        toaster.create({
            description: `Ошибка при ${text} пользователей: ${status} ${code}`,
            type: "error",
            closable: true,
        });
    } else {
        toaster.create({
            description: `Неизвестная ошибка при ${text} пользователей`,
            type: "error",
            closable: true,
        });
    }
    useTableStore.getState().hydrate(queryClient.getQueryData([QK.users]));
}
