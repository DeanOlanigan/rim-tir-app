import { NavLink } from "react-router-dom";
import { HStack, Button } from "@chakra-ui/react";

function Navigation() {
    const navItems = [
        { name: "Конфигурация", path: "/configuration" },
        { name: "Мониторинг", path: "/monitoring" },
        { name: "Логирование", path: "/log" },
        { name: "Журналирование", path: "/journal" },
        { name: "Графики", path: "/graphs" },
    ];

    return (
        <HStack as="nav" gap={"2"}>
            {navItems.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    tabIndex={-1}
                >
                    {({ isActive }) => (
                        <Button
                            shadow={isActive ? "md" : ""}
                            size={"xs"}
                            variant={isActive ? "solid" : "ghost"}
                            fontSize={"sm"}
                        >
                            {item.name}
                        </Button>
                    )}
                </NavLink>
            ))}
        </HStack>
    );
}

export default Navigation;
