import { Float, HStack, VStack } from "@chakra-ui/react";

export const EditorLayout = ({
    title,
    counter,
    parameters,
    breadcrumbs,
    table,
    errors,
}) => {
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
                bg={"bg.panel"}
                position={"relative"}
            >
                <Float placement={"top-center"}>{errors}</Float>
                <HStack w={"100%"} justify={"space-between"}>
                    {title}
                    <HStack justify={"end"}>{counter}</HStack>
                </HStack>
                {parameters}
            </VStack>
            {table}
        </VStack>
    );
};
