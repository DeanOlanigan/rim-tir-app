import {
    Avatar,
    Badge,
    Circle,
    Float,
    HStack,
    Icon,
    IconButton,
    Menu,
    Portal,
    Spacer,
    Text,
    VStack,
} from "@chakra-ui/react";
import {
    LuActivity,
    LuBadgeAlert,
    LuChartLine,
    LuClock3,
    LuCog,
    LuCpu,
    LuLogOut,
    LuNotebook,
    LuScrollText,
    LuSettings,
    LuSquareMousePointer,
} from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { Tooltip } from "../ui/tooltip";
import { hasRight } from "@/utils/permissions";
import { useAuth } from "@/hooks/useAuth";
import { ColorModeIcon, useColorMode } from "../ui/color-mode";
import { useMqttMetrics } from "@/hooks/useMqttMetrics";
import { CONN_STATUS } from "@/config/constants";
import { getMetricColor } from "@/utils/utils";
import { Connect } from "../Metrics/Connect";
import { useLogoutMutation } from "@/hooks/useMutation";
import { CanAccess } from "@/CanAccess";
import { JOURNAL_DIALOG_ID, journalDialog } from "@/journalDialog";
import { useJournalStream } from "@/pages/JournalPage/JournalStores/journal-stream-store";
import { SoftwareVersion } from "../Metrics/SoftwareVersion";

const navItems = [
    {
        name: "Конфигурация",
        path: "configuration",
        icon: LuCog,
        right: "config.view",
        type: "link",
    },
    {
        name: "Мониторинг",
        path: "monitoring",
        icon: LuActivity,
        right: "monitoring.view",
        type: "link",
    },
    {
        name: "Логирование",
        path: "log",
        icon: LuScrollText,
        right: "logs.view",
        type: "link",
    },
    {
        name: "Журналирование",
        path: "journal",
        icon: LuNotebook,
        right: "journal.view",
        type: "link",
    },
    {
        name: "Графики",
        path: "graph",
        icon: LuChartLine,
        right: "graphs.view",
        type: "link",
    },
    {
        name: "Редактор HMI",
        path: "HMIEditor",
        icon: LuSquareMousePointer,
        right: "hmi.view",
        type: "link",
    },
];

export const Sidebar = () => {
    const { user } = useAuth();

    return (
        <VStack
            w="72px"
            minW="72px"
            h="100vh"
            bg="bg.panel"
            borderRightWidth="0.25rem"
            borderColor="colorPalette.subtle"
            px="2"
            py="8"
        >
            {/* Верх */}
            <VStack gap="2" w={"100%"}>
                {navItems
                    .filter((item) => hasRight(user, item.right))
                    .map((item) => (
                        <NavLink key={item.path} to={item.path} tabIndex={-1}>
                            {({ isActive }) => (
                                <Tooltip
                                    showArrow
                                    content={item.name}
                                    positioning={{ placement: "right" }}
                                    openDelay={150}
                                >
                                    <IconButton
                                        size={"md"}
                                        variant={isActive ? "solid" : "ghost"}
                                        aria-label={item.name}
                                        css={{
                                            _icon: {
                                                width: "5",
                                                height: "5",
                                            },
                                        }}
                                    >
                                        <Icon as={item.icon} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </NavLink>
                    ))}
                <AlertJournal />
            </VStack>

            <Spacer />

            {/* Низ */}
            <VStack gap="2" w={"100%"}>
                <Connect />
                <StatusTile
                    icon={LuClock3}
                    label={"Время"}
                    sub={"stats/time"}
                    color={"green"}
                    format={(value) => new Date(value).toLocaleTimeString()}
                />
                <StatusTile
                    icon={LuCpu}
                    label={"CPU"}
                    sub={"stats/cpu"}
                    color={"purple"}
                />
                <StatusTile
                    icon={LuCpu}
                    label={"RAM"}
                    sub={"stats/ram"}
                    color={"orange"}
                />
                <CanAccess right={"settings.view"}>
                    <NavLink to={"settings"} tabIndex={-1}>
                        {({ isActive }) => (
                            <Tooltip
                                content="Настройки"
                                positioning={{ placement: "right" }}
                                openDelay={150}
                            >
                                <IconButton
                                    size={"md"}
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
                </CanAccess>
                <ThemeBtn />
                <UserBlock user={user} />
                <SoftwareVersion />
            </VStack>
        </VStack>
    );
};

const AlertJournal = () => {
    const live = useJournalStream((state) => state.live);
    return (
        <CanAccess right={"journal.view"}>
            <Tooltip
                showArrow
                content={"Журнал тревог"}
                positioning={{ placement: "right" }}
                openDelay={150}
            >
                <IconButton
                    size={"md"}
                    variant={"ghost"}
                    aria-label="Logout"
                    position={"relative"}
                    css={{
                        _icon: {
                            width: "5",
                            height: "5",
                        },
                    }}
                    onClick={() => journalDialog.open(JOURNAL_DIALOG_ID)}
                >
                    <LuBadgeAlert />
                    {live.length > 0 && (
                        <Float placement={"top-end"} offset={1}>
                            <Circle size="4" bg="red" color="white">
                                <Text fontSize={"xs"}>{live.length}</Text>
                            </Circle>
                        </Float>
                    )}
                </IconButton>
            </Tooltip>
        </CanAccess>
    );
};

const ThemeBtn = () => {
    const { toggleColorMode } = useColorMode();

    return (
        <Tooltip
            content="Сменить тему"
            positioning={{ placement: "right" }}
            openDelay={150}
        >
            <IconButton
                onClick={toggleColorMode}
                variant="ghost"
                aria-label="Toggle color mode"
                size="md"
                css={{
                    _icon: {
                        width: "5",
                        height: "5",
                    },
                }}
            >
                <ColorModeIcon />
            </IconButton>
        </Tooltip>
    );
};

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];
const pickPalette = (name) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
};
const UserBlock = ({ user }) => {
    const logoutMutation = useLogoutMutation();
    return (
        <Menu.Root
            lazyMount
            unmountOnExit
            positioning={{ placement: "right-end" }}
        >
            <Menu.Trigger rounded="md" focusRing="outside">
                <Avatar.Root
                    size="md"
                    colorPalette={pickPalette(user.name)}
                    shape="rounded"
                >
                    <Avatar.Image src={user.avatar} />
                    <Avatar.Fallback name={user.name} />
                </Avatar.Root>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content
                        display={"flex"}
                        flexDirection={"column"}
                        zIndex={"popover"}
                        gap="2"
                    >
                        <HStack>
                            <Avatar.Root
                                size="lg"
                                colorPalette={pickPalette(user.name)}
                                shape="rounded"
                            >
                                <Avatar.Image src={user.avatar} />
                                <Avatar.Fallback name={user.name} />
                            </Avatar.Root>
                            <Text>{user.name}</Text>
                        </HStack>
                        <Menu.Item
                            value={"logout"}
                            onClick={logoutMutation.mutate}
                        >
                            <LuLogOut />
                            Выйти
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

function StatusTile({
    icon,
    label,
    sub,
    color,
    format = (value) => `${value}%`,
}) {
    const { value, status } = useMqttMetrics(sub, {
        staleMs: 2500,
        timeoutMs: 5000,
    });

    let data = "----";
    if (status === CONN_STATUS.LIVE) {
        data = format(value);
    }

    const bg = getMetricColor(status, color);

    return (
        <Tooltip
            content={`${label}: ${data}`}
            positioning={{ placement: "right" }}
            openDelay={150}
        >
            <Badge
                colorPalette={bg}
                flexDirection={"column"}
                py={1}
                px={0}
                w={"50px"}
                variant={"outline"}
                justifyContent={"center"}
            >
                <Icon as={icon} boxSize="4" />
                <Text
                    fontSize="2xs"
                    lineHeight="1"
                    textAlign="center"
                    userSelect={"none"}
                >
                    {label}
                </Text>
                <Text
                    fontSize="2xs"
                    fontWeight="600"
                    lineHeight="1"
                    textAlign="center"
                    maxW="100%"
                    userSelect={"none"}
                    truncate
                >
                    {data}
                </Text>
            </Badge>
        </Tooltip>
    );
}
