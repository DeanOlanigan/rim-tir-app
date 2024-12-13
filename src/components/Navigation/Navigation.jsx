import { useLocation, Link } from "react-router-dom";
import { Tabs } from "@chakra-ui/react";

function Navigation() {
    const { pathname } = useLocation();
    const lastPathFragment = pathname.substring(pathname.lastIndexOf("/") +1 );
    const activeTab = lastPathFragment.length > 0 ? lastPathFragment : "configuration";

    return (
        <Tabs.Root defaultValue={activeTab}>
            <Tabs.List>
                <Tabs.Trigger asChild value="configuration">
                    <Link to="/">Конфигурация</Link>
                </Tabs.Trigger>
                <Tabs.Trigger asChild value="monitoring">
                    <Link to="/monitoring">Мониторинг</Link>
                </Tabs.Trigger>
                <Tabs.Trigger asChild value="log">
                    <Link to="/log">Логирование</Link>
                </Tabs.Trigger>
                <Tabs.Trigger asChild value="journal">
                    <Link to="/journal">Журналирование</Link>
                </Tabs.Trigger>
                <Tabs.Indicator/>
            </Tabs.List>    
        </Tabs.Root>
    );
}

export default Navigation;