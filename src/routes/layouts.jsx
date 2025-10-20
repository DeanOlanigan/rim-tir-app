import Header from "@/components/Header/Header";
import { Toaster } from "@/components/ui/toaster";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { Suspense } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";

export const PublicLayout = () => {
    return (
        <Box minH={"100dvh"} display={"flex"} flexDirection={"column"}>
            <ScrollRestoration />
            <Outlet />
        </Box>
    );
};

export const PrivateLayout = () => {
    return (
        <>
            <Toaster />
            <Header />
            <ScrollRestoration />
            <Outlet />
        </>
    );
};

export const PageSuspesnse = () => {
    return (
        <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
            <Heading>Загрузка...</Heading>
        </Flex>
    );
};

export const WideLayout = () => {
    return (
        <Flex as={"main"} flexGrow={1} direction={"column"}>
            <Suspense fallback={<PageSuspesnse />}>
                <Outlet />
            </Suspense>
        </Flex>
    );
};

export const CenteredLayout = () => {
    return (
        <Container
            maxW={"6xl"}
            px={{ base: 4, md: 6 }}
            py={{ base: 4, md: 6 }}
            as={"main"}
            flex={1}
            display={"flex"}
            flexDirection={"column"}
            minH={0}
            overflow={"hidden"}
        >
            <Suspense fallback={<PageSuspesnse />}>
                <Outlet />
            </Suspense>
        </Container>
    );
};
