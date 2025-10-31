import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Flex, Heading } from "@chakra-ui/react";
import { router } from "./routes";

const SuspenseLoader = () => {
    return (
        <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
            <Heading>Загрузка...</Heading>
        </Flex>
    );
};

export const AppRouter = () => {
    return (
        <Suspense fallback={<SuspenseLoader />}>
            <RouterProvider router={router} />
        </Suspense>
    );
};
