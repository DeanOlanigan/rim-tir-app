import { Stack } from "@chakra-ui/react";
import { Updates } from "./Settings/Updates";
import { UsersView } from "./Settings/Users/UsersVeiw";
import { Lecesne } from "./Lecense";
import { Settings } from "./Settings";

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
            <Settings />
            <UsersView />
            <Updates />
            <Lecesne />
        </Stack>
    );
};
