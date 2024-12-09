import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ConfigurationPage from '../pages/ConfigurationPage/ConfigurationPage';
import MonitoringPage from '../pages/MonitoringPage';
import LogPage from '../pages/LogPage/LogPage';
import JournalPage from '../pages/JournalPage';

const AppRoutes = () => (
    <Suspense fallback={<div>Загрузка...</div>}>
        <Routes>
            <Route path="/" element={<ConfigurationPage />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
            <Route path="/log" element={<LogPage />} />
            <Route path="/journal" element={<JournalPage />} />
        </Routes>
    </Suspense>
);

export default AppRoutes;
