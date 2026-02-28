import { NavLink } from "react-router-dom";
import { Button, Flex, Icon } from "@chakra-ui/react";
import {
    LuActivity,
    LuChartLine,
    LuCog,
    LuScrollText,
    LuSquareMousePointer,
} from "react-icons/lu";

const navItems = [
    { name: "Конфигурация", path: "configuration", icon: LuCog },
    { name: "Мониторинг", path: "monitoring", icon: LuActivity },
    { name: "Логирование", path: "log", icon: LuScrollText },
    //{ name: "Журналирование", path: "journal" },
    { name: "Графики", path: "graph", icon: LuChartLine },
    { name: "Редактор HMI", path: "HMIEditor", icon: LuSquareMousePointer },
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
