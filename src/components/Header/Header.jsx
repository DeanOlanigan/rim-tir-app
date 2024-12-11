import { Flex, IconButton, Text, Button, Skeleton } from '@radix-ui/themes';
import { GearIcon, ExitIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useContext, useEffect, useState } from 'react';
import ThemeContext from '../../context/ThemeContext';
import Navigation from '../Navigation/Navigation';
import ConnectionStatus from '../ConnectionStatus/ConnectionStatus';
import './Header.css';

const Header = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [ version, setVersion ] = useState('');

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const response = await fetch('http://192.168.1.1:8080/api/v1/getSoftwareVer');
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки: ${response.statusText}`);
                }
                const result = await response.json();
                if (result.code === 200) {
                    setVersion(result.data || []);
                } else {
                    throw new Error(result.message || "Неизвестная ошибка");
                }
            } catch (err) {
                throw new Error(err.message);
            }
        };
        fetchVersion();
    }, []);

    const handleLogout = async () => {
        const response = await fetch('/api/v1/logout',{ method: 'POST', credentials: 'include' });
        if (response.ok) {
            localStorage.removeItem('session_expiration_time');
            localStorage.removeItem('csrf');
            window.location.href = '/login';
        } else {
            alert('Logout failed');
        }
    };

    return (
        <header className='header'>
            <Flex gap="4" align="center" width="270px" justify="start">
                <Skeleton loading={!version}>
                    <Text weight="medium">{version || '7.7.77-7'}</Text>
                </Skeleton>
                <IconButton variant="ghost">
                    <GearIcon width={18} height={18} />
                </IconButton>
            </Flex>
            <Navigation />
            <Flex gap="4" align="center" width="270px" justify="end">
                <ConnectionStatus />
                <Button variant="ghost" weight="medium" onClick={handleLogout}>
                    <ExitIcon />
                    Выход
                </Button>
                <IconButton variant="ghost" onClick={toggleTheme}>
                    {theme === 'light' ? <MoonIcon width={18} height={18} /> : <SunIcon width={18} height={18} />}
                </IconButton>
            </Flex>
        </header>
    );
};

export default Header;
