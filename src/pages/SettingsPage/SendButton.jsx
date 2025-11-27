import { Button } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiv2 } from "@/api/baseUrl";
import { useSettingStore } from "./Settings/SettingsStore/settings-store";

export const SendButton = () => {
    const client = useQueryClient();
    const resetChanged = useSettingStore((s) => s.resetChanged);

    const settingsMutation = useMutation({
        mutationKey: ["settingsSender"],
        mutationFn: async () => {
            const newSettings = await client.getQueryData(["settings"]);
            await apiv2
                .put("/setsettings", newSettings, {
                    headers: { "Content-Type": "application/json" },
                    title: "New Settings",
                })
                .then((res) => console.log(res))
                .catch((err) => {
                    console.log(err);
                });
        },
        onSuccess: () => {
            console.log("COOL");
            resetChanged();
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
