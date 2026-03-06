import { useAuth } from "@/hooks/useAuth";
import { hasRight } from "@/utils/permissions";
import { VStack } from "@chakra-ui/react";
import { SidebarNavItem } from "../Sidebar/SidebarNavItem";
import { SidebarSettingsItem } from "../Sidebar/SidebarSettingsItem";
import { ThemeBtn } from "../Sidebar/ThemeBtn";
import { UserBlock } from "../Sidebar/UserBlock";
import { SoftwareVersion } from "../Metrics/SoftwareVersion";
import { useMemo } from "react";
import { navItems } from "../Navigation/nav-items";

export const MobileSidebarContent = ({ setOpen }) => {
    const { user } = useAuth();

    const allowedNavItems = useMemo(
        () => navItems.filter((item) => hasRight(user, item.right)),
        [user],
    );

    return (
        <VStack w="full" h={"full"} p={4} align="stretch">
            <VStack flex={1} minH={0}>
                {allowedNavItems.map((item) => (
                    <SidebarNavItem
                        key={item.path}
                        to={item.path}
                        icon={item.icon}
                        label={item.name}
                        collapsed={false}
                        onClick={() => setOpen(false)}
                    />
                ))}
            </VStack>
            <VStack>
                <SidebarSettingsItem collapsed={false} />
                <ThemeBtn collapsed={false} />
                <UserBlock user={user} collapsed={false} />
                <SoftwareVersion />
            </VStack>
        </VStack>
    );
};
