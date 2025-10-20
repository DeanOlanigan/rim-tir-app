import { lazy } from "react";
import {
    CenteredLayout,
    PrivateLayout,
    PublicLayout,
    WideLayout,
} from "./layouts";
import { AuthGate } from "./guards";
import { configurationLoader, monitoringLoader } from "./loaders";

const LoginPage =           lazy(() => import("@/pages/LoginPage/LoginPage")); // prettier-ignore
const ConfigurationPage =   lazy(() => import("@/pages/ConfigurationPage/ConfigurationPage")); // prettier-ignore
const MonitoringPage =      lazy(() => import("@/pages/MonitoringPage/MonitoringPage")); // prettier-ignore
const LogPage =             lazy(() => import("@/pages/LogPage/LogLayout")); // prettier-ignore
const JournalPage =         lazy(() => import("@/pages/JournalPage/JournalPage")); // prettier-ignore
const GraphPage =           lazy(() => import("@/pages/GraphsPage/GraphPage")); // prettier-ignore

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
                        ],
                    },
                    {
                        element: <CenteredLayout />,
                        children: [
                            { path: "log", element: <LogPage /> },
                            { path: "journal", element: <JournalPage /> },
                            { path: "graph", element: <GraphPage /> },
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
