import { Stack } from "@chakra-ui/react";
import { JournalSettings } from "./Settings/JournalSettings";
import { LogSettings } from "./Settings/LogSettings";
import { ServerSettings } from "./Settings/WebServSettings";
import { Loader } from "@/components/Loader";
import { SendButton } from "./SendButton";
import { useSettingStore } from "./Settings/SettingsStore/settings-store";
import { useSettings } from "./Settings/hooks/useSettings";
import { useEffect } from "react";
import { ErrorModal } from "./Settings/ErrorModal";

export const Settings = () => {
    const { data: settings, isLoading, isError, refetch } = useSettings();
    const setSet = useSettingStore((s) => s.setSettings);

    useEffect(() => setSet(settings), [settings]);

    return isLoading ? (
        <Stack gap="3" position={"relative"} h={"xl"}>
            <Loader text={"Загрузка настроек"} />
        </Stack>
    ) : (
        <>
            {isError && (
                <ErrorModal
                    text={"Ошибка загрузки настроек"}
                    refetch={refetch}
                />
            )}
            <Stack gap="3">
                <ServerSettings settings={settings?.WebServer} />
                <LogSettings settings={settings?.Logs} />
                <JournalSettings settings={settings?.Journals} />
                <SendButton />
            </Stack>
        </>
    );
};
