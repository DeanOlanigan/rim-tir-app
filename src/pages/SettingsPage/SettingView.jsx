import { Stack } from "@chakra-ui/react";
import { Updates } from "./Settings/Updates";
import { UsersView } from "./Settings/Users/UsersVeiw";
import { License } from "./License";
import { Settings } from "./Settings";
import { CanAccess } from "@/CanAccess";

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
            <CanAccess right={"security.users.edit"}>
                <UsersView />
            </CanAccess>
            <CanAccess right={"system.software_update"}>
                <Updates />
            </CanAccess>
            <CanAccess right={"security.licensing.manage"}>
                <License />
            </CanAccess>
        </Stack>
    );
};
