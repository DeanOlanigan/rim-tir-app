import { useLocation, Link } from "react-router-dom";
import { Tabs } from "@chakra-ui/react";
import { useState, useEffect } from "react";

function Navigation() {
    const { pathname } = useLocation();
    const [activeTab, setActiveTab] = useState("configuration");

    useEffect(() => {
        const lastPathFragment = pathname.substring(pathname.lastIndexOf("/") + 1);
        if (lastPathFragment.length > 0) {
            setActiveTab(lastPathFragment);
        } else {
            setActiveTab("configuration");
        }
    }, [pathname]);

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