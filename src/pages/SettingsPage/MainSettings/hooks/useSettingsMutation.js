import { QK } from "@/api";
import { updateSettings } from "@/api/routes/settings.api";
import { toaster } from "@/components/ui/toaster";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useSettingsMutation = () => {
    const q = useQueryClient();
    return useMutation({
        mutationKey: ["settingsSender"],
        mutationFn: updateSettings,
        onSuccess: () => {
            q.invalidateQueries({ queryKey: QK.settings });
            toaster.create({
                description: "Настройки успешно применены!",
                type: "success",
                closable: true,
            });
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status || err?.message;
                const code = err.response?.data?.error?.code || err?.code;
                toaster.create({
                    description:
                        "Ошибка при применении настроек: " +
                        `${status} ${code}`,
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
