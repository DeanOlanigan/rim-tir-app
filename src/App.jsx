import './App.css'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Theme, IconButton, TabNav, Flex, Text, Skeleton, Button } from '@radix-ui/themes'
import { SunIcon, MoonIcon, GearIcon, ExitIcon } from '@radix-ui/react-icons'

import ConfigurationPage from './pages/ConfigurationPage/ConfigurationPage'
import MonitoringPage from './pages/MonitoringPage/MonitoringPage'
import LogPage from './pages/LogPage/LogPage'
import JournalPage from './pages/JournalPage/JournalPage'
import ConnectionStatus from './components/ConnectionStatus/ConnectionStatus'

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

function App() {
    const [themeAppearance, setThemeAppearance] = useState('dark');

    const toggleTheme = () => {
        setThemeAppearance(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
    <Theme appearance={themeAppearance} accentColor='grass' grayColor='slate'>
        <Router>
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1rem', position: 'relative' }}>
                    <Flex gap='4'align='center' width={'270px'} justify={'start'}>
                        <Skeleton>
                            <Text weight='medium'>0.9.67-1</Text>
                        </Skeleton>
                        <IconButton variant='ghost'>
                            <GearIcon width={18} height={18} />
                        </IconButton>
                    </Flex>
                    
                    <Navigation/>

                    <Flex gap='4'align='center' width={'270px'} justify={'end'}>
                        <ConnectionStatus />
                        <Button 
                            variant='ghost'
                            weight='medium'
                        >
                            <ExitIcon/>
                            Выход
                        </Button>
                        <IconButton 
                            variant='ghost'
                            onClick={toggleTheme}
                        >
                            {themeAppearance === 'light' ? <MoonIcon width={18} height={18}/> : <SunIcon width={18} height={18}/>}
                        </IconButton>
                    </Flex>

                </header>
                <main style={{ height: '100%' }}>
                    <Routes>
                        <Route path='/' element={<ConfigurationPage />} />
                        <Route path='/monitoring' element={<MonitoringPage />} />
                        <Route path='/log' element={<LogPage />} />
                        <Route path='/journal' element={<JournalPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    </Theme>
    )
}

export default App;
