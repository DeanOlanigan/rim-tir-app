import { HStack, VStack } from "@chakra-ui/react";

export const Wrapper = ({ title, counter, parameters, breadcrumbs, table }) => {
    return (
        <VStack gap={"4"} px={"1"} align={"start"} w={"100%"} h={"100%"}>
            {breadcrumbs}
            <VStack
                w={"100%"}
                border={"1px solid"}
                borderColor={"border"}
                borderRadius={"md"}
                shadow={"md"}
                p={"4"}
                gap={"4"}
            >
                <HStack w={"100%"} justify={"space-between"}>
                    {title}
                    {counter}
                </HStack>
                {parameters}
            </VStack>
            {table}
        </VStack>
    );
};
