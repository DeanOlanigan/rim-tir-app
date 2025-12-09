import { Button, IconButton } from "@chakra-ui/react";
import { useSettingStore } from "./Settings/SettingsStore/settings-store";
import { useSettingsMutation } from "./Settings/hooks/useSettingsMutation";
import { queryClient } from "@/queryClients";
import { LuRotateCcw } from "react-icons/lu";
import { Group } from "react-konva";

export const SendButton = () => {
    const settings = useSettingStore((s) => s.settings);
    const setSettings = useSettingStore.getState().setSettings;
    const settingsMutation = useSettingsMutation(queryClient, settings);

    const disabled =
        JSON.stringify(queryClient.getQueryData(["settings"])) ===
        JSON.stringify(settings);

    return (
        <Group attached width={"100%"}>
            <Button
                disabled={disabled}
                loading={settingsMutation.isPending}
                onClick={() => settingsMutation.mutate()}
                w={"95%"}
                borderRightRadius="0"
            >
                {disabled ? "Нет изменений" : "Применить изменения"}
            </Button>
            <IconButton
                w="5%"
                borderLeftRadius="0"
                disabled={disabled}
                title={disabled ? "Нечего сбрасывать" : "Сбросить"}
                onClick={() =>
                    setSettings(queryClient.getQueryData(["settings"]))
                }
            >
                <LuRotateCcw />
            </IconButton>
        </Group>
    );
};
