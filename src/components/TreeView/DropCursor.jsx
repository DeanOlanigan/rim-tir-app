import { Box } from "@chakra-ui/react";

export const DropCursor = ({top, left}) => {
    return (
        <Box
            w={"30%"}
            h={"0px"}
            borderTop={"2px solid"}
            borderColor={"border.inverted"}
            position={"absolute"}
            top={top}
            left={left}
        />
    );
};
