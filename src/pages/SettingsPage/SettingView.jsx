import { Stack } from "@chakra-ui/react";
import { ServerSettings } from "./Settings/WebServSettings";
import { RightsSettings } from "./Settings/RightsSettings";
import { LogSettings } from "./Settings/LogSettings";
import { JournalSettings } from "./Settings/JournalSettings";
import { Updates } from "./Settings/Updates";
import { UsersView } from "./Settings/Users/UsersVeiw";
import { Lecesne } from "./Lecense";

export const SettingView = () => {
    return (
        <Stack
            gap={"3"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <ServerSettings />
            <UsersView />
            <RightsSettings />
            <LogSettings />
            <JournalSettings />
            <Updates />
            <Lecesne />
        </Stack>
    );
};
