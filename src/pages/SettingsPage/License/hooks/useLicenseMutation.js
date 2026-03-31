import { activateLicense } from "@/api/routes/license.api";
import { toaster } from "@/components/ui/toaster";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useLicenseMutation = () => {
    return useMutation({
        mutationKey: ["license", "activate"],
        mutationFn: activateLicense,
        onError: (err) => {
            console.log(err);
            if (axios.isAxiosError(err)) {
                const status = err.response?.data?.error || err.message;
                const code = err.response?.status || err.code;
                toaster.create({
                    description:
                        "Ошибка при активации ПО: " + `${status} ${code}`,
                    type: "error",
                    closable: true,
                });
            } else {
                toaster.create({
                    description: "Неизвестная ошибка при применении настроек",
                    type: "error",
                    closable: true,
                });
            }
        },
    });
};
