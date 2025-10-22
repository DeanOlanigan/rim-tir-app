import Header from "@/components/Header/Header";
import { Toaster } from "@/components/ui/toaster";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
    return <Outlet />;
};

export const PrivateLayout = () => {
    return (
        <>
            <Toaster />
            <Header />
            <Box as={"main"} flex={1} minH={0}>
                <Outlet />
            </Box>
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
        <Flex as={"section"} direction={"column"} h={"100%"} minH={0}>
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
            display={"flex"}
            h={"100%"}
            minH={0}
            maxW={"6xl"}
            flex={1}
            flexDirection={"column"}
            overflow={"hidden"}
            px={{ base: 4, md: 6 }}
            py={{ base: 4, md: 6 }}
        >
            <Suspense fallback={<PageSuspesnse />}>
                <Outlet />
            </Suspense>
        </Container>
    );
};
