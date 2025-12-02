import { Button } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSettingStore } from "./Settings/SettingsStore/settings-store";
import { useSettingsMutation } from "./Settings/hooks/useSettingsMutation";

export const SendButton = () => {
    const client = useQueryClient();

    const settings = useSettingStore((s) => s.settings);

    const settingsMutation = useSettingsMutation(client, settings);

    const disabled =
        JSON.stringify(client.getQueryData(["settings"])) ===
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
