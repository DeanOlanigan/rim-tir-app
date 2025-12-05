import { lazy } from "react";
import {
    CenteredLayout,
    PrivateLayout,
    PublicLayout,
    WideLayout,
} from "./layouts";
import { AuthGate } from "./guards";
import {
    configurationLoader,
    monitoringLoader,
    settingsLoader,
} from "./loaders";
import { createBrowserRouter } from "react-router-dom";
import { ErrorSettings } from "@/pages/SettingsPage/Settings/ErrorSettings";

const LoginPage =           lazy(() => import("@/pages/LoginPage/LoginPage")); // prettier-ignore
const ConfigurationPage =   lazy(() => import("@/pages/ConfigurationPage/ConfigurationPage")); // prettier-ignore
const MonitoringPage =      lazy(() => import("@/pages/MonitoringPage/MonitoringPage")); // prettier-ignore
const LogPage =             lazy(() => import("@/pages/LogPage/LogLayout")); // prettier-ignore
const JournalPage =         lazy(() => import("@/pages/JournalPage/JournalPage")); // prettier-ignore
const GraphPage =           lazy(() => import("@/pages/GraphsPage/GraphPage")); // prettier-ignore
const TestPage =            lazy(() => import("@/pages/TestPage/TestPage")); // prettier-ignore
const SettingsPage =        lazy(() => import("@/pages/SettingsPage/SettingsPage")); // prettier-ignore

export const routes = [
    {
        element: <PublicLayout />,
        children: [
            { index: true, element: <LoginPage /> },
            { path: "login", element: <LoginPage /> },
        ],
    },
    {
        element: <AuthGate />,
        children: [
            {
                element: <PrivateLayout />,
                children: [
                    {
                        element: <WideLayout />,
                        children: [
                            {
                                path: "configuration",
                                loader: configurationLoader,
                                element: <ConfigurationPage />,
                            },
                            {
                                path: "monitoring",
                                loader: monitoringLoader,
                                element: <MonitoringPage />,
                            },
                            {
                                path: "test",
                                element: <TestPage />,
                            },
                        ],
                    },
                    {
                        element: <CenteredLayout />,
                        children: [
                            { path: "log", element: <LogPage /> },
                            { path: "journal", element: <JournalPage /> },
                            { path: "graph", element: <GraphPage /> },
                            {
                                path: "settings",
                                loader: settingsLoader,
                                errorElement: (
                                    <ErrorSettings
                                        text={"Ошибка загрузки настроек"}
                                    />
                                ),
                                element: <SettingsPage />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: "*",
        element: "404",
    },
];

export const router = createBrowserRouter(routes, { basename: "/" });
