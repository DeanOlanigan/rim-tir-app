import { Toaster } from "@/components/ui/toaster";
import { Container, Flex, Heading } from "@chakra-ui/react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { useAppStore } from "@/store/app-store";
import { journalDialog } from "@/journalDialog";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useMqttJournal } from "@/pages/JournalPage/hooks/useMqttJournal";

export const PublicLayout = () => {
    return <Outlet />;
};

export const PrivateLayout = () => {
    const fullScreenMode = useAppStore((state) => state.fullScreenMode);
    useMqttJournal();
    return (
        <>
            <journalDialog.Viewport />
            <Toaster />
            <Flex w={"100%"} h={"100%"} flex={1}>
                {!fullScreenMode && <Sidebar />}
                <Outlet />
            </Flex>
        </>
    );
};

export const PageSuspesnse = () => {
    return (
        <Flex
            w={"100%"}
            h={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Heading>Загрузка...</Heading>
        </Flex>
    );
};

export const WideLayout = () => {
    return (
        <Flex
            as={"section"}
            flex={1}
            minH={0}
            minW={0}
            w={"100%"}
            h={"100%"}
            direction={"column"}
        >
            <Suspense fallback={<PageSuspesnse />}>
                <Outlet />
            </Suspense>
        </Flex>
    );
};

export const CenteredLayout = () => {
    return (
        <Container
            as={"section"}
            minH={0}
            h={"100%"}
            maxW={"6xl"}
            px={{ base: 4, md: 6 }}
            py={{ base: 4, md: 6 }}
        >
            <Suspense fallback={<PageSuspesnse />}>
                <Outlet />
            </Suspense>
        </Container>
    );
};
