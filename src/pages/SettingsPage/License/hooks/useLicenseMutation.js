import { activateLicense } from "@/api/routes/license.api";
import { toaster } from "@/components/ui/toaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useLicenseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["license", "activate"],
        mutationFn: activateLicense,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["license"],
            });

            toaster.create({
                description: "Лицензия успешно активирована",
                type: "success",
                closable: true,
            });
        },
        onError: (err) => {
            console.log(err);
            if (axios.isAxiosError(err)) {
                const status =
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    err.message;

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
