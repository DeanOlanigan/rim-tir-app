import { Box, IconButton } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import { memo } from "react";

export const NodeToggleBtn = memo(function NodeToggleBtn({ toggle, isOpen }) {
    return (
        <IconButton
            size={"2xs"}
            variant={"plain"}
            onClick={() => {
                toggle();
            }}
            color={"fg.subtle"}
            _hover={{ color: "bg.inverted" }}
        >
            <Box
                w={"19.19px"}
                h={"19.19px"}
                as={LuChevronRight}
                transform={isOpen ? "rotate(90deg)" : "rotate(0deg)"}
                transition={"transform 0.2s ease-in-out"}
            />
        </IconButton>
    );
});
