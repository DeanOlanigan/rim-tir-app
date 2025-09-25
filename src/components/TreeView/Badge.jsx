import { Badge as ChakraBadge } from "@chakra-ui/react";

export const Badge = ({ isIgnored, shortname, label, color }) => {
    return (
        <ChakraBadge
            color={isIgnored ? "fg.subtle" : ""}
            colorPalette={isIgnored ? "gray" : color}
            size={"xs"}
            variant={"surface"}
            title={label}
        >
            {shortname}
        </ChakraBadge>
    );
};
