import { NavLink } from "react-router-dom";
import { Button, Flex, Icon } from "@chakra-ui/react";
import {
    LuActivity,
    LuChartLine,
    LuCog,
    LuScrollText,
    LuSquareMousePointer,
} from "react-icons/lu";
import { hasRight } from "@/utils/permissions";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
    {
        name: "Конфигурация",
        path: "configuration",
        icon: LuCog,
        right: "config.view",
    },
    {
        name: "Мониторинг",
        path: "monitoring",
        icon: LuActivity,
        right: "monitoring.view",
    },
    {
        name: "Логирование",
        path: "log",
        icon: LuScrollText,
        right: "logs.view",
    },
    //{ name: "Журналирование", path: "journal" },
    { name: "Графики", path: "graph", icon: LuChartLine, right: "graphs.view" },
    {
        name: "Редактор HMI",
        path: "HMIEditor",
        icon: LuSquareMousePointer,
        right: "hmi.view",
    },
];

function Navigation() {
    const { user } = useAuth();

    return (
        <Flex as="nav" gap={"2"}>
            {navItems
                .filter((item) => hasRight(user, item.right))
                .map((item) => (
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
