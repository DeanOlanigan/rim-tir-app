import { Center, Flex } from "@chakra-ui/react";

export const SubHeader = ({ children }) => {
    return (
        <Center
            borderBottom={"0.25rem solid"}
            borderColor={"colorPalette.subtle"}
            p={"2"}
        >
            <Flex gap={"2"} w={"4xl"} justify={"start"} align={"center"}>
                {children}
            </Flex>
        </Center>
    );
};
