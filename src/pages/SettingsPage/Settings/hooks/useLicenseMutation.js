import { apiv2 } from "@/api/baseUrl";
import { toaster } from "@/components/ui/toaster";
import { useMutation } from "@tanstack/react-query";


export const useLicenseMutation = (setActive) => {
    return useMutation({
        mutationKey: ["licenseActivator"],
        mutationFn: async ({ uuid, key }) => {
            await new Promise((res) => setTimeout(res, 1000));
            return await apiv2
                .post("activateLec", { uuid, key })
                .then((res) => console.log(res))
                .catch((err) => {
                    throw err;
                });
        },
        onSuccess: () => {
            setActive(true);
        },
        onError: (err) => {
            const status = err?.response?.data?.error || "NO CONNECTION";
            const code = err?.response?.status || "NO CONNECTION";
            toaster.create({
                description: "Ошибка при активации ПО: " + `${status} ${code}`,
                type: "error",
                closable: true,
            });
        },
    });
};