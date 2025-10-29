import {
    IconButton,
    Menu,
    Portal,
    Dialog,
    CloseButton,
    Center,
} from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LuSettings, LuLogOut } from "react-icons/lu";

import Navigation from "@/components/Navigation/Navigation";

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
