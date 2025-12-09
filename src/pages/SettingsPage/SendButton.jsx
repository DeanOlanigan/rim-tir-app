import { Button } from "@chakra-ui/react";
import { useSettingStore } from "./Settings/SettingsStore/settings-store";
import { useSettingsMutation } from "./Settings/hooks/useSettingsMutation";
import { queryClient } from "@/queryClients";

export const SendButton = () => {
    const settings = useSettingStore((s) => s.settings);

    const settingsMutation = useSettingsMutation(queryClient, settings);

    const disabled =
        JSON.stringify(queryClient.getQueryData(["settings"])) ===
        JSON.stringify(settings);

    return (
        <Button
            disabled={disabled}
            loading={settingsMutation.isPending}
            onClick={() => settingsMutation.mutate()}
        >
            {disabled ? "Нет изменений" : "Применить изменения"}
        </Button>
    );
};
