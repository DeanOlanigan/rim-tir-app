import { Center, Flex } from "@chakra-ui/react";

export const SubHeader = ({ children }) => {
    return (
        <Center
            borderBottom={"0.25rem solid"}
            borderColor={"colorPalette.subtle"}
        >
            <Flex
                p={"2"}
                w={"100%"}
                maxW={"4xl"}
                gap={"2"}
                h={"3rem"}
                align={"center"}
            >
                {children}
            </Flex>
        </Center>
    );
};
