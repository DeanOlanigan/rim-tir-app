import { apiv2 } from "@/api/baseUrl";
import { toaster } from "@/components/ui/toaster";
import { useMutation } from "@tanstack/react-query";
import { useSettingStore } from "../SettingsStore/settings-store";
import { queryClient } from "@/queryClients";
import { QK } from "@/api";
import axios from "axios";

export const useSettingsMutation = (settings) => {
    const setSettings = useSettingStore.getState().setSettings;
    return useMutation({
        mutationKey: ["settingsSender"],
        mutationFn: async () => {
            const res = await apiv2.put("/setsettings", settings, {
                headers: { "Content-Type": "application/json" },
                title: "New Settings",
            });
            return res;
        }, 
        onSuccess: () => {
            toaster.create({
                description: "Настройки успешно применены!",
                type: "success",
                closable: true,
            });
            queryClient.setQueryData(QK.settings, settings);
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status || err?.message;
                const code = err.response?.data?.error?.code || err?.code;
                toaster.create({
                    description:
                        "Ошибка при применении настроек: " + `${status} ${code}`,
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
            setSettings(queryClient.getQueryData(QK.settings));
        },
    });
};
