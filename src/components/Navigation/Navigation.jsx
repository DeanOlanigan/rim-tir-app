import { NavLink } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";

const navItems = [
    { name: "Конфигурация", path: "/configuration" },
    { name: "Мониторинг", path: "/monitoring" },
    { name: "Логирование", path: "/log" },
    { name: "Журналирование", path: "/journal" },
    { name: "Графики", path: "/graph" },
];

function Navigation() {
    return (
        <Flex as="nav" gap={"2"}>
            {navItems.map((item) => (
                <NavLink key={item.name} to={item.path} tabIndex={-1}>
                    {({ isActive }) => (
                        <Button
                            size={"xs"}
                            fontSize={"sm"}
                            variant={isActive ? "solid" : "ghost"}
                            shadow={isActive ? "md" : ""}
                        >
                            {item.name}
                        </Button>
                    )}
                </NavLink>
            ))}
        </Flex>
    );
}

export default Navigation;
