import { IconButton, Center, Flex, Icon, Text } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LuSettings, LuLogOut } from "react-icons/lu";
import {
    GiChewedSkull,
    GiGhost,
    GiPumpkin,
    GiPumpkinLantern,
    GiPumpkinMask,
} from "react-icons/gi";

import Navigation from "@/components/Navigation/Navigation";
import { NavLink } from "react-router-dom";
import { Tooltip } from "../ui/tooltip";

function Header() {
    return (
        <Center as={"header"} gap={"2"} p={"2"}>
            <Navigation />
            <SettingsMenu />
            <LogoutBtn />
            <ColorModeButton size={"xs"} />
        </Center>
    );
}
export default Header;

const SettingsMenu = () => {
    return (
        <NavLink to={"settings"}>
            {({ isActive }) => (
                <Tooltip showArrow content={<Text>Настройки</Text>}>
                    <IconButton
                        size={"xs"}
                        variant={isActive ? "solid" : "ghost"}
                        shadow={isActive ? "md" : ""}
                        aria-label="Settings"
                        css={{
                            _icon: {
                                width: "5",
                                height: "5",
                            },
                        }}
                    >
                        <LuSettings />
                    </IconButton>
                </Tooltip>
            )}
        </NavLink>
    );
};

const LogoutBtn = () => {
    return (
        <IconButton
            size={"xs"}
            variant={"ghost"}
            aria-label="Logout"
            css={{
                _icon: {
                    width: "5",
                    height: "5",
                },
            }}
        >
            <LuLogOut />
        </IconButton>
    );
};

// TODO потом придумать куда деть
// eslint-disable-next-line
const Pumpkins = () => {
    return (
        <Flex gap={"6"}>
            <Icon
                as={GiPumpkinLantern}
                size={"xl"}
                color={"orange.700"}
                rotate={"-10"}
            />
            <Icon as={GiPumpkinMask} size={"xl"} color={"orange.600"} />
            <Icon
                as={GiPumpkin}
                size={"xl"}
                color={"orange.700"}
                rotate={"10"}
            />
            <Icon
                as={GiGhost}
                size={"xl"}
                color={"orange.600"}
                rotate={"-10"}
            />
            <Icon
                as={GiChewedSkull}
                size={"xl"}
                color={"orange.700"}
                rotate={"10"}
            />
        </Flex>
    );
};
