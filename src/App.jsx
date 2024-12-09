import './App.css'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Theme, IconButton, Link as RadixLink, TabNav, Flex, Text } from '@radix-ui/themes'
import { SunIcon, MoonIcon, GearIcon } from '@radix-ui/react-icons'

import ConfigurationPage from './components/pages/ConfigurationPage/ConfigurationPage'
import MonitoringPage from './components/pages/MonitoringPage'
import LogPage from './components/pages/LogPage'
import JournalPage from './components/pages/JournalPage'

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
                <header style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1rem 0 1rem' }}>
                    <Flex gap='4'align='center'>
                    <Text weight='medium'>
                        TIR
                    </Text>
                    <IconButton variant='ghost'>
                        <GearIcon width={18} height={18} />
                    </IconButton>
                    </Flex>

                    <Navigation />

                    <Flex gap='4'align='center'>
                    <RadixLink 
                        weight='medium'
                        href='#'
                        underline='hover'
                    >
                        Выход
                    </RadixLink>
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
