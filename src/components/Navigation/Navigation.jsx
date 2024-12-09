import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { TabNav } from "@radix-ui/themes";

function Navigation() {
    const { pathname } = useLocation();

    return (
        <TabNav.Root defaultValue="config">
            <TabNav.Link asChild active={pathname === '/'}>
                <Link to="/">Конфигурация</Link>
            </TabNav.Link>
            <TabNav.Link asChild active={pathname === '/monitoring'}>
                <Link to="/monitoring">Мониторинг</Link>
            </TabNav.Link>
            <TabNav.Link asChild active={pathname === '/log'}>
                <Link to="/log">Логирование</Link>
            </TabNav.Link>
            <TabNav.Link asChild active={pathname === '/journal'}>
                <Link to="/journal">Журналирование</Link>
            </TabNav.Link>
        </TabNav.Root>
    )
}

export default Navigation;