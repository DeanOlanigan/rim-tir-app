import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Tabs } from "@chakra-ui/react";

function Navigation() {
    const { pathname } = useLocation();

    return (
        <Tabs.Root defaultValue="config">
            <Tabs.List>
                <Tabs.Trigger asChild active={pathname === "/"}>
                    <Link to="/">Конфигурация</Link>
                </Tabs.Trigger>
                <Tabs.Trigger asChild active={pathname === "/monitoring"}>
                    <Link to="/monitoring">Мониторинг</Link>
                </Tabs.Trigger>
                <Tabs.Trigger asChild active={pathname === "/log"}>
                    <Link to="/log">Логирование</Link>
                </Tabs.Trigger>
                <Tabs.Trigger asChild active={pathname === "/journal"}>
                    <Link to="/journal">Журналирование</Link>
                </Tabs.Trigger>
                <Tabs.Indicator/>
            </Tabs.List>
        </Tabs.Root>
    );
}

export default Navigation;