import { Button } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiv2 } from "@/api/baseUrl";
import { useSettingStore } from "./Settings/SettingsStore/settings-store";
import { toaster } from "@/components/ui/toaster";

export const SendButton = () => {
    const client = useQueryClient();
    const resetChanged = useSettingStore((s) => s.resetChanged);

    const settingsMutation = useMutation({
        mutationKey: ["settingsSender"],
        mutationFn: async () => {
            const newSettings = await client.getQueryData(["settings"]);
            return await apiv2
                .put("/setsettings", newSettings, {
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
            resetChanged();
            toaster.create({
                description: "Настройки успешно применены!",
                type: "success",
                closable: true,
            });
        },
        onError: (err) => {
            resetChanged();
            const status =
                err?.response?.status || err?.message || "NO CONNECTION";
            const code = err?.response?.data?.error?.code || "NO CONNECTION";
            toaster.create({
                description:
                    "Ошибка при применении настроек: " + `${status} ${code}`,
                type: "error",
                closable: true,
            });
        },
    });

    const checkChanged = useSettingStore((s) => s.checkChanged);

    const disabled = !checkChanged();

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
