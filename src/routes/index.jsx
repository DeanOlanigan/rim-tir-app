import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { Flex, Heading } from "@chakra-ui/react";

const SuspenseLoader = () => {
    return (
        <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
            <Heading>Загрузка...</Heading>
        </Flex>
    );
};

export const AppRouter = () => {
    const router = createBrowserRouter(routes, { basename: "/" });

    return (
        <Suspense fallback={<SuspenseLoader />}>
            <RouterProvider router={router} />
        </Suspense>
    );
};
