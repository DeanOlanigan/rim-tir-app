import {
    HStack,
    StackSeparator,
    useBreakpointValue,
    VStack,
} from "@chakra-ui/react";
import { hasRight } from "@/utils/permissions";
import { useAuth } from "@/hooks/useAuth";
import { SoftwareVersion } from "../Metrics/SoftwareVersion";
import { useAppStore } from "@/store/app-store";
import { ThemeBtn } from "./ThemeBtn";
import { UserBlock } from "./UserBlock";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarSettingsItem } from "./SidebarSettingsItem";
import { AlertJournal } from "./AlertJournal";
import { CollapseBtn } from "./CollapseBtn";
import { StatusBlock } from "./StatusBlock";
import { useMemo } from "react";
import { navItems } from "../Navigation/nav-items";

export const Sidebar = () => {
    const { user } = useAuth();
    const userCollapsed = useAppStore((s) => s.sideBarCollapsed);
    const isMobile = useBreakpointValue({ base: true, lg: false });
    const collapsed = isMobile || userCollapsed;
    const setCollapsed = useAppStore((s) => s.toggleSideBarCollapsed);

    const allowedNavItems = useMemo(
        () => navItems.filter((item) => hasRight(user, item.right)),
        [user],
    );

    return (
        <VStack
            w={"full"}
            flex={1}
            minH={0}
            maxW={collapsed ? "16" : "48"}
            bg="bg.panel"
            borderRightWidth="0.25rem"
            borderColor="colorPalette.subtle"
            py={4}
            px={2}
            align={"stretch"}
        >
            <VStack
                flex={1}
                minH={0}
                gap={4}
                align={"center"}
                separator={<StackSeparator />}
            >
                {!isMobile && (
                    /* Кнопка свернуть/развернуть */
                    <HStack
                        w={"100%"}
                        justify={collapsed ? "center" : "flex-end"}
                    >
                        <CollapseBtn
                            collapsed={collapsed}
                            setCollapsed={setCollapsed}
                        />
                    </HStack>
                )}

                {/* Верх */}
                <VStack align={"center"} overflow={"auto"} p={1}>
                    {allowedNavItems.map((item) => (
                        <SidebarNavItem
                            key={item.path}
                            to={item.path}
                            icon={item.icon}
                            label={item.name}
                            collapsed={collapsed}
                        />
                    ))}
                </VStack>
                <AlertJournal collapsed={collapsed} />
            </VStack>

            {/* Низ */}
            <VStack gap={4} align={"center"} separator={<StackSeparator />}>
                <StatusBlock collapsed={collapsed} />
                <VStack w={"100%"}>
                    <SidebarSettingsItem collapsed={collapsed} />
                    <ThemeBtn collapsed={collapsed} />
                    <UserBlock user={user} collapsed={collapsed} />
                    <SoftwareVersion />
                </VStack>
            </VStack>
        </VStack>
    );
};
