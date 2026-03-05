import {
    Avatar,
    Badge,
    Box,
    Button,
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
    LuChevronRight,
    LuClock3,
    LuCog,
    LuCpu,
    LuLogOut,
    LuNotebook,
    LuPanelLeftClose,
    LuPanelLeftOpen,
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
import { useAppStore } from "@/store/app-store";

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
    const collapsed = useAppStore((s) => s.sideBarCollapsed);
    const setCollapsed = useAppStore((s) => s.toggleSideBarCollapsed);

    const W_COLLAPSED = "70px";
    const W_WIDE = "230px";

    return (
        <VStack
            w={{ base: W_COLLAPSED, lg: collapsed ? W_COLLAPSED : W_WIDE }}
            minW={{ base: W_COLLAPSED, lg: collapsed ? W_COLLAPSED : W_WIDE }}
            h="100vh"
            bg="bg.panel"
            borderRightWidth="0.25rem"
            borderColor="colorPalette.subtle"
            px={{ base: "2", lg: "3" }}
            py={{ base: "8", lg: "6" }}
            align={"stretch"}
        >
            <HStack justify="flex-end" w="100%">
                <Tooltip
                    content={collapsed ? "Развернуть меню" : "Свернуть меню"}
                    positioning={{ placement: "right" }}
                    openDelay={150}
                >
                    <IconButton
                        onClick={setCollapsed}
                        variant="ghost"
                        size="sm"
                        display={{ base: "none", lg: "inline-flex" }} // на мобилке не нужно
                    >
                        <Icon
                            as={collapsed ? LuPanelLeftOpen : LuPanelLeftClose}
                            boxSize="5"
                        />
                    </IconButton>
                </Tooltip>
            </HStack>

            {/* Верх */}
            <VStack gap="2" w={"100%"}>
                {navItems
                    .filter((item) => hasRight(user, item.right))
                    .map((item) => (
                        <SidebarNavItem
                            key={item.path}
                            item={item}
                            collapsed={collapsed}
                        />
                    ))}
                <AlertJournal />
            </VStack>

            <Spacer />

            {/* Низ */}
            <VStack gap="2" w={"100%"} align={"start"}>
                <Connect />
                <StatusTile
                    icon={LuClock3}
                    label={"Время"}
                    sub={"stats/time"}
                    color={"green"}
                    format={(value) => new Date(value).toLocaleTimeString()}
                    collapsed={collapsed}
                />
                <StatusTile
                    icon={LuCpu}
                    label={"CPU"}
                    sub={"stats/cpu"}
                    color={"purple"}
                    collapsed={collapsed}
                />
                <StatusTile
                    icon={LuCpu}
                    label={"RAM"}
                    sub={"stats/ram"}
                    color={"orange"}
                    collapsed={collapsed}
                />
                <CanAccess right={"settings.view"}>
                    <SidebarSettingsItem collapsed={collapsed} />
                </CanAccess>
                <ThemeBtn collapsed={collapsed} />
                <UserBlock user={user} collapsed={collapsed} />
                <SoftwareVersion />
            </VStack>
        </VStack>
    );
};

const SidebarNavItem = ({ item, collapsed }) => {
    return (
        <NavLink to={item.path} tabIndex={-1} style={{ width: "100%" }}>
            {({ isActive }) => (
                <Tooltip
                    showArrow
                    content={item.name}
                    positioning={{ placement: "right" }}
                    openDelay={150}
                >
                    <SidebarButton
                        icon={item.icon}
                        isActive={isActive}
                        aria-label={item.name}
                        collapsed={collapsed}
                    >
                        {item.name}
                    </SidebarButton>
                </Tooltip>
            )}
        </NavLink>
    );
};

const SidebarSettingsItem = ({ collapsed }) => (
    <NavLink to="settings" tabIndex={-1} style={{ width: "100%" }}>
        {({ isActive }) => (
            <Tooltip
                content="Настройки"
                positioning={{ placement: "right" }}
                openDelay={150}
            >
                <SidebarButton
                    icon={LuSettings}
                    isActive={isActive}
                    aria-label="Настройки"
                    collapsed={collapsed}
                >
                    Настройки
                </SidebarButton>
            </Tooltip>
        )}
    </NavLink>
);

const AlertJournal = ({ collapsed }) => {
    const live = useJournalStream((state) => state.live);

    return (
        <CanAccess right="journal.view">
            <Tooltip
                showArrow
                content="Журнал тревог"
                positioning={{ placement: "right" }}
                openDelay={150}
            >
                <Box position="relative" w="100%">
                    <SidebarButton
                        icon={LuBadgeAlert}
                        isActive={false}
                        aria-label="Журнал тревог"
                        collapsed={collapsed}
                        onClick={() => journalDialog.open(JOURNAL_DIALOG_ID)}
                    >
                        Журнал тревог
                    </SidebarButton>

                    {live.length > 0 && (
                        <Float placement="top-end" offset={1}>
                            <Circle size="4" bg="red.solid" color="white">
                                <Text fontSize="2xs">{live.length}</Text>
                            </Circle>
                        </Float>
                    )}
                </Box>
            </Tooltip>
        </CanAccess>
    );
};

const ThemeBtn = ({ collapsed }) => {
    const { toggleColorMode } = useColorMode();

    return (
        <Tooltip
            content="Сменить тему"
            positioning={{ placement: "right" }}
            openDelay={150}
        >
            <SidebarButton
                icon={ColorModeIcon}
                isActive={false}
                aria-label="Сменить тему"
                collapsed={collapsed}
                onClick={toggleColorMode}
            >
                Сменить тему
            </SidebarButton>
        </Tooltip>
    );
};

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];
const pickPalette = (name) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
};
const UserBlock = ({ user, collapsed }) => {
    const logoutMutation = useLogoutMutation();
    return (
        <Menu.Root
            lazyMount
            unmountOnExit
            positioning={{ placement: "right-end" }}
        >
            <Menu.Trigger rounded="md" focusRing="outside" w={"100%"} asChild>
                <Button variant={"ghost"} p={0} w={"100%"}>
                    <HStack
                        w={"100%"}
                        justify={{ base: "center", lg: "flex-start" }}
                    >
                        <Avatar.Root
                            size="sm"
                            colorPalette={pickPalette(user.name)}
                            shape="rounded"
                        >
                            <Avatar.Image src={user.avatar} />
                            <Avatar.Fallback name={user.name} />
                        </Avatar.Root>
                        <VStack
                            align="start"
                            gap={0}
                            display={{
                                base: "none",
                                lg: collapsed ? "none" : "block",
                            }}
                        >
                            <Text fontSize="sm" fontWeight="medium" truncate>
                                {user.name}
                            </Text>
                            {user.roleNames.map((name) => (
                                <Badge key={name} variant="subtle" size={"xs"}>
                                    {name}
                                </Badge>
                            ))}
                        </VStack>
                    </HStack>
                    <Icon
                        as={LuChevronRight}
                        display={{
                            base: "none",
                            lg: collapsed ? "none" : "block",
                        }}
                    />
                </Button>
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
    collapsed,
}) {
    const { value, status } = useMqttMetrics(sub, {
        staleMs: 2500,
        timeoutMs: 5000,
    });

    let data = "----";
    if (status === CONN_STATUS.LIVE) data = format(value);

    const bg = getMetricColor(status, color);

    const wide = !collapsed;

    return (
        <Tooltip
            content={`${label}: ${data}`}
            positioning={{ placement: "right" }}
            openDelay={150}
        >
            <Badge
                colorPalette={bg}
                variant="outline"
                py={{ base: 1, lg: wide ? 2 : 1 }}
                px={{ base: 0, lg: wide ? 3 : 0 }}
                w={{ base: "50px", lg: wide ? "100%" : "50px" }}
                display="flex"
                flexDirection={{ base: "column", lg: wide ? "row" : "column" }}
                alignItems="center"
                justifyContent="center"
                minW={0}
            >
                <Icon as={icon} boxSize="4" flexShrink={0} />

                <Text
                    display={{ base: "block", lg: wide ? "none" : "block" }}
                    fontSize="2xs"
                    lineHeight="1"
                    textAlign="center"
                    userSelect="none"
                >
                    {label}
                </Text>

                <Text
                    display={{ base: "none", lg: wide ? "block" : "none" }}
                    fontSize="xs"
                    lineHeight="1"
                    userSelect="none"
                    flex="1"
                    truncate
                >
                    {label}
                </Text>

                <Text
                    fontSize="2xs"
                    fontWeight="600"
                    lineHeight="1"
                    textAlign="center"
                    truncate
                    userSelect="none"
                >
                    {data}
                </Text>
            </Badge>
        </Tooltip>
    );
}

const SidebarButton = ({
    icon,
    children,
    isActive,
    onClick,
    collapsed,
    ...props
}) => {
    return (
        <Button
            onClick={onClick}
            size="md"
            variant={isActive ? "solid" : "ghost"}
            justifyContent={{
                base: "center",
                lg: collapsed ? "center" : "flex-start",
            }}
            w="100%"
            minW="0"
            px={{ base: 0, lg: collapsed ? 0 : 3 }}
            css={{ _icon: { width: "5", height: "5" } }}
            {...props}
        >
            <Icon as={icon} flexShrink={0} />
            <Text
                display={{ base: "none", lg: collapsed ? "none" : "block" }}
                ml="3"
                fontSize="sm"
                fontWeight="medium"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
            >
                {children}
            </Text>
        </Button>
    );
};
