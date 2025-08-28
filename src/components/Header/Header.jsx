import {
    Flex,
    IconButton,
    Text,
    Skeleton,
    Box,
    Menu,
    Portal,
    Dialog,
    CloseButton,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LuSettings, LuLogOut } from "react-icons/lu";
//import { useContext } from "react";
//import { AuthContext } from "@/providers/AuthProvider/AuthContext";
import PropTypes from "prop-types";

import Navigation from "@/components/Navigation/Navigation";
import ConnectionStatus from "@/components/ConnectionStatus/ConnectionStatus";
import { useAuth } from "@/hooks/useAuth";

function Header() {
    const [version, setVersion] = useState("");
    const { logout } = useAuth();

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const response = await fetch(
                    "http://192.168.1.1:8080/api/v1/getSoftwareVer"
                );
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.code === 200) {
                    setVersion(result.data || []);
                } else {
                    throw new Error(result.message || "Неизвестная ошибка");
                }
            } catch (error) {
                throw new Error(error.message);
            }
        };
        fetchVersion();
    }, []);

    return (
        <header style={{ padding: "0.5rem 0.5rem 0 0.5rem" }}>
            <Box
                bg={"bg.subtle"}
                padding={"0.5rem"}
                border={"1px solid"}
                borderColor={"border"}
                borderRadius={"md"}
                shadow={"xl"}
            >
                <Flex justify={"space-between"}>
                    <Flex gap="4" align="center" width="270px" justify="start">
                        <Skeleton loading={!version}>
                            <Text fontWeight={"medium"}>
                                {version || "7.7.77-7"}
                            </Text>
                        </Skeleton>
                        <SettingsMenu />
                    </Flex>
                    <Navigation />
                    <Flex gap="2" align="center" width="270px" justify="end">
                        <ConnectionStatus />
                        <Tooltip content="Выйти" disabled>
                            <IconButton
                                size={"xs"}
                                variant={"ghost"}
                                onClick={logout}
                                css={{
                                    _icon: {
                                        width: "5",
                                        height: "5",
                                    },
                                }}
                            >
                                <LuLogOut />
                            </IconButton>
                        </Tooltip>
                        <ColorModeButton size={"xs"} />
                        {/* <LocaleButton /> */}
                    </Flex>
                </Flex>
            </Box>
        </header>
    );
}
Header.propTypes = {
    onSnowfall: PropTypes.func,
};

export default Header;

const SettingsMenu = () => {
    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <IconButton
                    size={"xs"}
                    variant="ghost"
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
