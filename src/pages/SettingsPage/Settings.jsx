import { Stack } from "@chakra-ui/react";
import { JournalSettings } from "./Settings/JournalSettings";
import { LogSettings } from "./Settings/LogSettings";
import { ServerSettings } from "./Settings/WebServSettings";
import { SendButton } from "./SendButton";
import { useSettingStore } from "./Settings/SettingsStore/settings-store";
import { useSettings } from "./Settings/hooks/useSettings";
import { useEffect } from "react";

export const Settings = () => {
    const { data: settings } = useSettings();
    const setSet = useSettingStore.getState().setSettings;

    useEffect(() => setSet(settings));

    return (
        <Stack gap="3">
            <ServerSettings settings={settings?.WebServer} />
            <LogSettings settings={settings?.Logs} />
            <JournalSettings settings={settings?.Journals} />
            <SendButton />
        </Stack>
    );
};
