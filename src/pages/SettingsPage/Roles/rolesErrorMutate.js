import { toaster } from "@/components/ui/toaster";
import axios from "axios";
import { CK } from "../crudKeys";
import { useRightsAndRolesStore } from "./store/rights-and-roles-store";
import { QK } from "@/api";

export function rolesErrorMutate(err, queryClient, crudKey) {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status || err?.message;
        const code = err.response?.data?.error?.code || err?.code;
        toaster.create({
            description: `Ошибка при ${CK[crudKey]} ролей: ${status} ${code}`,
            type: "error",
            closable: true,
        });
    } else {
        toaster.create({
            description: `Неизвестная ошибка при ${CK[crudKey]} ролей`,
            type: "error",
            closable: true,
        });
    }
    useRightsAndRolesStore
        .getState()
        .setRoles(queryClient.getQueryData(QK.roles));
}
