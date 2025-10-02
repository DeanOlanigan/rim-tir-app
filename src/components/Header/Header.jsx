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
    Icon,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { ColorModeButton } from "@/components/ui/color-mode";
import {
    LuSettings,
    LuLogOut,
    LuCpu,
    LuMemoryStick,
    LuClock,
    LuHexagon,
} from "react-icons/lu";
import { useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider/AuthContext";

import Navigation from "@/components/Navigation/Navigation";
import ConnectionStatus from "@/components/ConnectionStatus/ConnectionStatus";
import { useQuery } from "@tanstack/react-query";
import { getSoftwareVer } from "@/api/shared";
import { QK } from "@/api/queryKeys";
import { useTopic } from "@/utils/mqtt/listener/useTopic";

function Header() {
    return (
        <Center as={"header"} gap={"2"} p={"2"}>
            {/* <Logo /> */}
            <Navigation />
            {/* <ConnectionStatus /> */}
            <SoftwareVersion />
            {/* <TestWs /> */}
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

/* const TestWs = () => {
    const value = useChannel("server.stats", {
        mode: "poll",
        intervalMs: 1000,
        fields: ["time", "cpu", "ram"],
    });
    return (
        <Flex gap={"1"}>
            <Skeleton loading={!value}>
                <Badge variant={"subtle"} colorPalette={"green"}>
                    <LuClock />
                    <Text minW={"7ch"}>
                        {value && new Date(value?.time).toLocaleTimeString()}
                    </Text>
                </Badge>
            </Skeleton>
            <Skeleton loading={!value}>
                <Badge variant={"subtle"} colorPalette={"purple"}>
                    <LuCpu />
                    <Text minW={"4ch"}>{value?.cpu}%</Text>
                </Badge>
            </Skeleton>
            <Skeleton loading={!value}>
                <Badge variant={"subtle"} colorPalette={"orange"}>
                    <LuMemoryStick />
                    <Text minW={"4ch"}>{value?.ram}%</Text>
                </Badge>
            </Skeleton>
        </Flex>
    );
}; */

const TestMqtt = () => {
    return (
        <Flex gap={"2"}>
            <MqttTime />
            <MqttCpu />
            <MqttRam />
        </Flex>
    );
};

const MqttRam = () => {
    const { data, connected } = useTopic("stats/ram");

    return (
        <Skeleton loading={!connected}>
            <Badge variant={"subtle"} colorPalette={"orange"}>
                <LuMemoryStick />
                <Text minW={"4ch"}>{data}%</Text>
            </Badge>
        </Skeleton>
    );
};

const MqttCpu = () => {
    const { data, connected } = useTopic("stats/cpu");

    return (
        <Skeleton loading={!connected}>
            <Badge variant={"subtle"} colorPalette={"purple"}>
                <LuCpu />
                <Text minW={"4ch"}>{data}%</Text>
            </Badge>
        </Skeleton>
    );
};

const MqttTime = () => {
    const { data, connected } = useTopic("stats/time");

    return (
        <Skeleton loading={!connected}>
            <Badge variant={"subtle"} colorPalette={"green"}>
                <LuClock />
                <Text minW={"7ch"}>
                    {data && new Date(data).toLocaleTimeString()}
                </Text>
            </Badge>
        </Skeleton>
    );
};

const LogoutBtn = () => {
    const { logout } = useContext(AuthContext);
    return (
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
    );
};

const Logo = () => {
    return (
        <Flex align={"center"} gap={"1"} me={"4"}>
            <Icon size={"md"} fill={"green.400"} as={LuHexagon} />
            <Text fontWeight={"bold"}>RIM-TIR</Text>
        </Flex>
    );
};
