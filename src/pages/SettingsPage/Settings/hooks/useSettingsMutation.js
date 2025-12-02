import { apiv2 } from "@/api/baseUrl";
import { toaster } from "@/components/ui/toaster";
import { useMutation } from "@tanstack/react-query";
import { useSettingStore } from "../SettingsStore/settings-store";



export const useSettingsMutation = (client, settings) => {
    const setSettings = useSettingStore((s) => s.setSettings);
    return useMutation({
        mutationKey: ["settingsSender"],
        mutationFn: async () => {
            return await apiv2
                .put("/setsettings", settings, {
                    headers: { "Content-Type": "application/json" },
                    title: "New Settings",
                })
                .then((res) => console.log(res))
                .catch((err) => {
                    throw err;
                });
        },
        onSuccess: () => {
            console.log("COOL");
            toaster.create({
                description: "Настройки успешно применены!",
                type: "success",
                closable: true,
            });
            client.setQueryData(["settings"], settings);
        },
        onError: (err) => {
            const status =
                err?.response?.status || err?.message || "NO CONNECTION";
            const code = err?.response?.data?.error?.code || "NO CONNECTION";
            toaster.create({
                description:
                    "Ошибка при применении настроек: " + `${status} ${code}`,
                type: "error",
                closable: true,
            });
            setSettings(client.getQueryData(["settings"]));
        },
    });
};