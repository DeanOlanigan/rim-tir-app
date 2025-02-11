import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "../providers/AuthProvider/AuthProvider";
import ProtectedRouter from "./ProtectedRoutes";

import { Redirect } from "../pages/Redirect";

import ConfigurationPage from "../pages/ConfigurationPage/ConfigurationPage";
import MonitoringPage from "../pages/MonitoringPage/MonitoringPage";
import JournalPage from "../pages/JournalPage/JournalPage";
import LoginForm from "../pages/LoginPage/LoginPage";
import { SessionExpired } from "../pages/SessionExpired";

//import LogPage from "../pages/LogPage/LogPage";
import LogLayout from "../pages/LogPage/LogLayout";
import LogRedirect from "../pages/LogPage/LogRedirect";
import LogSourceManager from "../pages/LogPage/SourceManager/LogSourceManager";
import RequireLogData from "../pages/LogPage/RequireLogData";
import LogViewer from "../pages/LogPage/Viewer/LogViewer";

import GraphLayout from "../pages/GraphsPage/GraphLayout";
import GraphRedirect from "../pages/GraphsPage/GraphRedirect";
import GraphSettings from "../pages/GraphsPage/GraphSettings/GraphSettings";
import RequireGraphData from "../pages/GraphsPage/RequireGraphData";
import GraphViewer from "../pages/GraphsPage/Viewer/GraphViewer";

function AppRouter() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Redirect />} />
                    <Route path="/" element={<Redirect />} />
                    {/*
                        Страница авторизации, редирект на нее, если пользователь не авторизован. 
                        Редирект на ConfigurationPage после успешной авторизации.
                        Если пользователь уже авторизован, то редирект на ConfigurationPage 
                    */}
                    <Route path="login" element={<LoginForm />} />
                    <Route path="expired" element={<SessionExpired />} />
                    {/* 
                        Защищенные маршруты, которые доступны после авторизации.
                        Редирект на страницу авторизации, если пользователь не авторизован.
                        Проверка авторизации проверкой времени сессии. Сервер отправляет длительность сессии и время сервера для корректирови часовых поясов.
                        Если до конца сессии отсталось меньше минуты, то пользователя нужно предупредить о скором истечении сессии с возможностью ее продления.
                    */}
                    <Route element={<ProtectedRouter />}>
                        <Route path="/configuration" element={<ConfigurationPage />} />
                        <Route path="/monitoring" element={<MonitoringPage />} />
                        <Route path="/log" element={<LogLayout />} >
                            <Route index element={<LogRedirect />} />
                            <Route path="settings" element={<LogSourceManager />} />
                            <Route path="viewer" element={<RequireLogData />} >
                                <Route index element={<LogViewer />} />
                            </Route>
                        </Route>
                        <Route path="/journal" element={<JournalPage />} />
                        <Route path="/graph" element={<GraphLayout />} >
                            <Route index element={<GraphRedirect />} />
                            <Route path="settings" element={<GraphSettings />} />
                            <Route path="viewer" element={<RequireGraphData />} >
                                <Route index element={<GraphViewer />} />
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default AppRouter;
