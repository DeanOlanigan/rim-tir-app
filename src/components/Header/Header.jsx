import { Flex, IconButton, Text, Button } from '@radix-ui/themes';
import { GearIcon, ExitIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useTheme } from '../../utils/useTheme';
import Navigation from '../Navigation/Navigation';
import ConnectionStatus from '../ConnectionStatus/ConnectionStatus';
import './Header.css';

const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className='header'>
            <Flex gap="4" align="center" width="270px" justify="start">
                <Text weight="medium">0.9.67-1</Text>
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
