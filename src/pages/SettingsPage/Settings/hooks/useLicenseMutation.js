import { QK } from "@/api";
import { apiv2 } from "@/api/baseUrl";
import { toaster } from "@/components/ui/toaster";
import { queryClient } from "@/queryClients";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useLicenseMutation = (setIsKeyEnd, uuid) => {
    return useMutation({
        mutationKey: ["licenseActivator"],
        mutationFn: async ({ uuid, key }) => {
            await new Promise((res) => setTimeout(res, 1000));
            const res = await apiv2.post("activateLec", { uuid, key });
            return res;
        },
        onSuccess: () => {
            queryClient.setQueryData(["license", uuid], (oldData) => {
                if (!oldData) return { isActive: false };
                return {
                    ...oldData,
                    isActive: true
                };
            });
            setIsKeyEnd(false);
        },
        onError: (err) => {
            console.log(err);
            if (axios.isAxiosError(err)) {
                const status = err.response?.data?.error || err.message;
                const code = err.response?.status || err.code;
                toaster.create({
                    description: "Ошибка при активации ПО: " + `${status} ${code}`,
                    type: "error",
                    closable: true,
                });
            } else {
                toaster.create({
                    description:
                        "Неизвестная ошибка при применении настроек",
                    type: "error",
                    closable: true,
                });
            }
        },
    });
};
