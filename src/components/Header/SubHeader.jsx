import { Center } from "@chakra-ui/react";

export const SubHeader = ({ children }) => {
    return (
        <Center
            borderBottom={"0.25rem solid"}
            borderColor={"colorPalette.subtle"}
            p={"2"}
            gap={"2"}
            h={"3rem"}
            flexShrink={0}
        >
            {children}
        </Center>
    );
};
