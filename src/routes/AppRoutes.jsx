import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "@/providers/AuthProvider/AuthProvider";
import ProtectedRouter from "./ProtectedRoutes";

import { Redirect } from "@/pages/Redirect";

import JournalPage from "@/pages/JournalPage/JournalPage";
import LoginForm from "@/pages/LoginPage/LoginPage";
import { SessionExpired } from "@/pages/SessionExpired";

import LogPage from "@/pages/LogPage/LogLayout";

import GraphPage from "@/pages/GraphsPage/GraphPage";
import { Suspense } from "react";
import ConfigurationPageLazy from "@/pages/ConfigurationPage/ConfigurationPageLazy";
import MonitoringPageLazy from "@/pages/MonitoringPage/MonitoringPageLazy";
import { TirLoaderIcon } from "@/components/TirLoaderIcon";
import { Flex, Text } from "@chakra-ui/react";
import { PageContainer } from "@/components/PageContainer";

const SuspenseLoader = () => {
    return (
        <Flex
            w={"full"}
            h={"full"}
            align={"center"}
            justify={"center"}
            direction={"column"}
            bg={"blackAlpha.500"}
        >
            <TirLoaderIcon height={"256px"} />
            <Text color={"fg.muted"} fontWeight={"medium"}>
                Загрузка...
            </Text>
        </Flex>
    );
};

function AppRouter() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Suspense fallback={<SuspenseLoader />}>
                    <Routes>
                        <Route path="*" element={<Redirect />} />
                        <Route path="/" element={<Redirect />} />

                        <Route path="login" element={<LoginForm />} />
                        <Route path="expired" element={<SessionExpired />} />
                        <Route element={<ProtectedRouter />}>
                            <Route
                                path="/configuration"
                                element={<ConfigurationPageLazy />}
                            />
                            <Route
                                path="/monitoring"
                                element={<MonitoringPageLazy />}
                            />
                            <Route element={<PageContainer />}>
                                <Route path="/log" element={<LogPage />} />
                                <Route
                                    path="/journal"
                                    element={<JournalPage />}
                                />
                                <Route path="/graph" element={<GraphPage />} />
                            </Route>
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default AppRouter;
