import {
    IconButton,
    Menu,
    Portal,
    Dialog,
    CloseButton,
    Center,
    Flex,
    Icon,
} from "@chakra-ui/react";
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

function Header() {
    return (
        <Center as={"header"} gap={"2"} p={"2"}>
            <Pumpkins />
            <Navigation />
            <SettingsMenu />
            <LogoutBtn />
            <ColorModeButton size={"xs"} />
            <Pumpkins />
        </Center>
    );
}
export default Header;

const SettingsMenu = () => {
    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <IconButton
                    size={"xs"}
                    variant="ghost"
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
            </Menu.Trigger>

            <Menu.Positioner>
                <Menu.Content>
                    <Dialog.Root lazyMount unmountOnExit>
                        <Dialog.Trigger asChild>
                            <Menu.Item value="update" closeOnSelect={false}>
                                Обновление
                            </Menu.Item>
                        </Dialog.Trigger>
                        <Portal>
                            <Dialog.Positioner>
                                <Dialog.Content>
                                    <Dialog.Header>
                                        <Dialog.Title>Обновление</Dialog.Title>
                                    </Dialog.Header>
                                    <Dialog.Body></Dialog.Body>
                                    <Dialog.CloseTrigger asChild>
                                        <CloseButton size={"sm"} />
                                    </Dialog.CloseTrigger>
                                </Dialog.Content>
                            </Dialog.Positioner>
                        </Portal>
                    </Dialog.Root>
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
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
