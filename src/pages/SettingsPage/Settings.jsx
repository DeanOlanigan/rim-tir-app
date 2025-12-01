import { Stack } from "@chakra-ui/react";
import { JournalSettings } from "./Settings/JournalSettings";
import { LogSettings } from "./Settings/LogSettings";
import { ServerSettings } from "./Settings/WebServSettings";
import { Loader } from "@/components/Loader";
import { SendButton } from "./SendButton";
import { ErrorModal } from "./Settings/ErrorModal";
import { useSettingStore } from "./Settings/SettingsStore/settings-store";
import { useSettings } from "./Settings/hooks/useSettings";

export const Settings = () => {
    const { data: settings, isLoading, isError, refetch } = useSettings();
    const setSet = useSettingStore((s) => s.setSettings);
    setSet(settings);

    return isLoading ? (
        <Stack gap="3" position={"relative"} h={"xl"}>
            <Loader text={"Загрузка настроек"} />
        </Stack>
    ) : (
        <Stack gap="3">
            {isError && (
                <ErrorModal
                    refetch={refetch}
                    text={"Ошибка загрузки настроек"}
                />
            )}
            <ServerSettings settings={settings?.WebServer} />
            <LogSettings settings={settings?.Logs} />
            <JournalSettings settings={settings?.Journals} />
            <SendButton />
        </Stack>
    );
};
