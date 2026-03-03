import { Footer } from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { Toaster } from "@/components/ui/toaster";
import { Container, Flex, Heading } from "@chakra-ui/react";
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
            <Outlet />
            <Footer />
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
            h={"100%"}
            direction={"column"}
            overflowY={"auto"}
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
