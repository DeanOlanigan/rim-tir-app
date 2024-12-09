import { Flex, IconButton, Text, Button, Skeleton } from '@radix-ui/themes';
import { GearIcon, ExitIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useContext } from 'react';
import ThemeContext from '../../context/ThemeContext';
import Navigation from '../Navigation/Navigation';
import ConnectionStatus from '../ConnectionStatus/ConnectionStatus';
import './Header.css';

const Header = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <header className='header'>
            <Flex gap="4" align="center" width="270px" justify="start">
                <Skeleton><Text weight="medium">0.9.67-1</Text></Skeleton>
                <IconButton variant="ghost">
                    <GearIcon width={18} height={18} />
                </IconButton>
            </Flex>
            <Navigation />
            <Flex gap="4" align="center" width="270px" justify="end">
                <ConnectionStatus />
                <Button variant="ghost" weight="medium">
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
