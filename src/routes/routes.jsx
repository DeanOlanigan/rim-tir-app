import { lazy } from "react";
import {
    CenteredLayout,
    PrivateLayout,
    PublicLayout,
    WideLayout,
} from "./layouts";
import { AuthGate, GuestGate, PermissionGate } from "./guards";
import {
    configurationLoader,
    monitoringLoader,
    settingsLoader,
} from "./loaders";
import { createBrowserRouter } from "react-router-dom";
import { ErrorScreamer } from "@/components/Error/Error";

const LoginPage =           lazy(() => import("@/pages/LoginPage/LoginPage")); // prettier-ignore
const ConfigurationPage =   lazy(() => import("@/pages/ConfigurationPage/ConfigurationPage")); // prettier-ignore
const MonitoringPage =      lazy(() => import("@/pages/MonitoringPage/MonitoringPage")); // prettier-ignore
const LogPage =             lazy(() => import("@/pages/LogPage/LogLayout")); // prettier-ignore
const JournalPage =         lazy(() => import("@/pages/JournalPage/JournalPage")); // prettier-ignore
const GraphPage =           lazy(() => import("@/pages/GraphsPage/GraphPage")); // prettier-ignore
const GraphPageNew =        lazy(() => import("@/pages/GraphPageNew/GraphPageNew")); // prettier-ignore
const SettingsPage =        lazy(() => import("@/pages/SettingsPage/SettingsPage")); // prettier-ignore
const HMIEditor =           lazy(() => import("@/pages/HMIEditor/HMIEditor")); // prettier-ignore

export const routes = [
    {
        element: <GuestGate />,
        children: [
            {
                element: <PublicLayout />,
                children: [
                    { index: true, element: <LoginPage /> },
                    { path: "login", element: <LoginPage /> },
                ],
            },
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
                                element: (
                                    <PermissionGate right={"config.view"} />
                                ),
                                children: [
                                    {
                                        path: "configuration",
                                        loader: configurationLoader,
                                        element: <ConfigurationPage />,
                                    },
                                ],
                            },
                            {
                                element: (
                                    <PermissionGate right={"monitoring.view"} />
                                ),
                                children: [
                                    {
                                        path: "monitoring",
                                        loader: monitoringLoader,
                                        element: <MonitoringPage />,
                                    },
                                ],
                            },
                            {
                                element: <PermissionGate right={"hmi.view"} />,
                                children: [
                                    {
                                        path: "HMIEditor",
                                        element: <HMIEditor />,
                                    },
                                ],
                            },
                            {
                                element: (
                                    <PermissionGate right={"journal.view"} />
                                ),
                                children: [
                                    {
                                        path: "journal",
                                        element: <JournalPage />,
                                    },
                                ],
                            },
                            {
                                element: (
                                    <PermissionGate right={"graphs.view"} />
                                ),
                                children: [
                                    { path: "graph", element: <GraphPage /> },
                                ],
                            },
                            {
                                element: (
                                    <PermissionGate right={"graphs.view"} />
                                ),
                                children: [
                                    {
                                        path: "graphnew",
                                        element: <GraphPageNew />,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        element: <CenteredLayout />,
                        children: [
                            {
                                element: <PermissionGate right={"logs.view"} />,
                                children: [
                                    { path: "log", element: <LogPage /> },
                                ],
                            },
                            {
                                element: (
                                    <PermissionGate right={"settings.view"} />
                                ),
                                children: [
                                    {
                                        path: "settings",
                                        loader: settingsLoader,
                                        errorElement: (
                                            <ErrorScreamer
                                                text={
                                                    "Ошибка загрузки страницы настроек"
                                                }
                                                page={"/settings"}
                                                keys={[
                                                    "settings",
                                                    "license",
                                                    "roles",
                                                    "users",
                                                ]}
                                            />
                                        ),
                                        element: <SettingsPage />,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: "403",
                        element: "403",
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
