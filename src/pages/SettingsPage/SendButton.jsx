import { Button } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiv2 } from "@/api/baseUrl";
import { useSettingStore } from "./Settings/SettingsStore/settings-store";
import { toaster } from "@/components/ui/toaster";

export const SendButton = () => {
    const client = useQueryClient();

    const settings = useSettingStore((s) => s.settings);
    const setSettings = useSettingStore((s) => s.setSettings);

    const settingsMutation = useMutation({
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

    const disabled =
        JSON.stringify(client.getQueryData(["settings"])) ===
        JSON.stringify(settings);

    return (
        <Button
            disabled={disabled}
            loading={settingsMutation.isPending}
            onClick={() => settingsMutation.mutate()}
        >
            Применить
        </Button>
    );
};
