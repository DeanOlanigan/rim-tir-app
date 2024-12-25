import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "../providers/AuthProvider/AuthProvider";
import ProtectedRouter from "./ProtectedRoutes";

import ConfigurationPage from "../pages/ConfigurationPage/ConfigurationPage";
import MonitoringPage from "../pages/MonitoringPage/MonitoringPage";
import LogPage from "../pages/LogPage/LogPage";
import JournalPage from "../pages/JournalPage/JournalPage";
import LoginForm from "../pages/LoginPage/LoginPage";

/* function AppRoutes() {
    return (
        <Suspense fallback={<div>Загрузка...</div>}>
            <Routes>
                <Route path="/" element={<ConfigurationPage />} />
                <Route path="/monitoring" element={<MonitoringPage />} />
                <Route path="/log" element={<LogPage />} />
                <Route path="/journal" element={<JournalPage />} />
            </Routes>
        </Suspense>    
    );
}; */

function AppRouter() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/*
                        Страница авторизации, редирект на нее, если пользователь не авторизован. 
                        Редирект на ConfigurationPage после успешной авторизации.
                        Если пользователь уже авторизован, то редирект на ConfigurationPage 
                    */}
                    <Route path="login" element={<LoginForm />} />
                    {/* 
                        Защищенные маршруты, которые доступны после авторизации.
                        Редирект на страницу авторизации, если пользователь не авторизован.
                        Проверка авторизации проверкой времени сессии. Сервер отправляет длительность сессии и время сервера для корректирови часовых поясов.
                        Если до конца сессии отсталось меньше минуты, то пользователя нужно предупредить о скором истечении сессии с возможностью ее продления.
                    */}
                    <Route element={<ProtectedRouter />}>
                        <Route path="/configuration" element={<ConfigurationPage />} />
                        <Route path="/monitoring" element={<MonitoringPage />} />
                        <Route path="/log/*" element={<LogPage />} />
                        <Route path="/journal" element={<JournalPage />} />
                        <Route path="*" element={<Navigate to="/configuration" replace />} />
                        <Route path="/" element={<Navigate to="/configuration" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default AppRouter;
