import { Stack } from "@chakra-ui/react";
import { ServerSettings } from "./Settings/WebServSettings";
import { LogSettings } from "./Settings/LogSettings";
import { JournalSettings } from "./Settings/JournalSettings";
import { Updates } from "./Settings/Updates";
import { UsersView } from "./Settings/Users/UsersVeiw";
import { Lecesne } from "./Lecense";
import { SendButton } from "./SendButton";

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
            <LogSettings />
            <JournalSettings />
            <SendButton />
            <UsersView />
            <Updates />
            <Lecesne />
        </Stack>
    );
};
