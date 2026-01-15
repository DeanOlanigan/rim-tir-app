import { toaster } from "@/components/ui/toaster";
import axios from "axios";

export function rolesErrorMutate(err, text) {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status || err?.message;
        const code = err.response?.data?.error?.code || err?.code;
        toaster.create({
            description: `Ошибка при ${text} ролей: ${status} ${code}`,
            type: "error",
            closable: true,
        });
    } else {
        toaster.create({
            description: `Неизвестная ошибка при ${text} ролей`,
            type: "error",
            closable: true,
        });
    }
}
