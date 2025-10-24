import {
    Flex,
    IconButton,
    Text,
    Skeleton,
    Menu,
    Portal,
    Dialog,
    CloseButton,
    Badge,
    Center,
} from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LuSettings, LuLogOut } from "react-icons/lu";

import Navigation from "@/components/Navigation/Navigation";
import { useQuery } from "@tanstack/react-query";
import { getSoftwareVer } from "@/api/shared";
import { QK } from "@/api/queryKeys";
import { MqttTime } from "./MqttMetrics/MqttTime";
import { MqttCpu } from "./MqttMetrics/MqttCpu";
import { MqttRam } from "./MqttMetrics/MqttRam";
import { Connect } from "./MqttMetrics/Connect";

function Header() {
    return (
        <Center as={"header"} gap={"2"} p={"2"}>
            <Navigation />
            <SoftwareVersion />
            <TestMqtt />
            <SettingsMenu />
            <LogoutBtn />
            <ColorModeButton size={"xs"} />
        </Center>
    );
}
export default Header;

const SoftwareVersion = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: QK.version,
        queryFn: getSoftwareVer,
    });

    return (
        <Skeleton loading={isLoading}>
            <Badge
                variant={"subtle"}
                colorPalette={isError ? "red" : "cyan"}
                textAlign={"center"}
                title={
                    isError
                        ? "Ошибка считывания версии ПК"
                        : `Текущая версия ПК: ${data?.data}`
                }
            >
                <Text minW={"10ch"}>{isError ? "Ошибка" : data?.data}</Text>
            </Badge>
        </Skeleton>
    );
};

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

const TestMqtt = () => {
    return (
        <Flex gap={"2"}>
            <MqttTime />
            <MqttCpu />
            <MqttRam />
            <Connect />
        </Flex>
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
