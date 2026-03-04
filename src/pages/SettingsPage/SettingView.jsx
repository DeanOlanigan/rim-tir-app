import { Stack } from "@chakra-ui/react";
import { Updates } from "./Update/Updates";
import { UsersView } from "./Users/UsersVeiw";
import { License } from "./License/License";
import { Settings } from "./MainSettings/Settings";
import { CanAccess } from "@/CanAccess";

export const SettingView = () => {
    return (
        <Stack
            p={4}
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
