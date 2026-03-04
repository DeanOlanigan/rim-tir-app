import { Stack } from "@chakra-ui/react";
import { JournalSettings } from "./Settings/JournalSettings";
import { LogSettings } from "./Settings/LogSettings";
import { ServerSettings } from "./Settings/WebServSettings";
import { SendButton } from "./SendButton";
import { useSettingStore } from "./Settings/SettingsStore/settings-store";
import { useSettings } from "./Settings/hooks/useSettings";
import { useEffect } from "react";
import { CanAccess } from "@/CanAccess";

export const Settings = () => {
    const { data: settings } = useSettings();

    useEffect(() => {
        useSettingStore.getState().setSettings(settings);
    }, [settings]);

    return (
        <Stack gap="3">
            <CanAccess right={"settings.web_server.edit"}>
                <ServerSettings />
            </CanAccess>
            <CanAccess right={"settings.logs.edit"}>
                <LogSettings />
            </CanAccess>
            <CanAccess right={"settings.journal.edit"}>
                <JournalSettings />
            </CanAccess>
            <CanAccess
                anyOf={[
                    "settings.web_server.edit",
                    "settings.logs.edit",
                    "settings.journal.edit",
                ]}
            >
                <SendButton />
            </CanAccess>
        </Stack>
    );
};
