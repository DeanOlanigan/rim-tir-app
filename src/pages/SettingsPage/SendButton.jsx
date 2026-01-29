import { Button, IconButton, Group } from "@chakra-ui/react";
import { useSettingStore } from "./Settings/SettingsStore/settings-store";
import { useSettingsMutation } from "./Settings/hooks/useSettingsMutation";
import { LuRotateCcw } from "react-icons/lu";
import { QK } from "@/api";
import { useQueryClient } from "@tanstack/react-query";

export const SendButton = () => {
    const settings = useSettingStore((s) => s.settings);
    const settingsMutation = useSettingsMutation(settings);
    const client = useQueryClient();

    const disabled =
        JSON.stringify(client.getQueryData(["settings"])) ===
        JSON.stringify(settings);

    return (
        <Group attached width={"100%"}>
            <Button
                disabled={disabled}
                loading={settingsMutation.isPending}
                onClick={() => settingsMutation.mutate()}
                w={"95%"}
            >
                {disabled ? "Нет изменений" : "Применить изменения"}
            </Button>
            <IconButton
                w="5%"
                disabled={disabled}
                title={disabled ? "Нечего сбрасывать" : "Сбросить"}
                onClick={() =>
                    useSettingStore
                        .getState()
                        .setSettings(client.getQueryData(QK.settings))
                }
            >
                <LuRotateCcw />
            </IconButton>
        </Group>
    );
};
