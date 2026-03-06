import { NavLink } from "react-router-dom";
import { Button, Flex, Icon } from "@chakra-ui/react";
import { hasRight } from "@/utils/permissions";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";
import { navItems } from "./nav-items";

function Navigation() {
    const { user } = useAuth();

    const allowedNavItems = useMemo(
        () => navItems.filter((item) => hasRight(user, item.right)),
        [user],
    );

    return (
        <Flex as="nav" gap={"2"}>
            {allowedNavItems.map((item) => (
                <NavLink key={item.name} to={item.path} tabIndex={-1}>
                    {({ isActive }) => (
                        <Button
                            size={"xs"}
                            fontSize={"sm"}
                            variant={isActive ? "solid" : "ghost"}
                            shadow={isActive ? "md" : ""}
                        >
                            <Icon as={item.icon} />
                            {item.name}
                        </Button>
                    )}
                </NavLink>
            ))}
        </Flex>
    );
}

export default Navigation;
