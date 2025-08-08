import { Badge as ChakraBadge } from "@chakra-ui/react";

export const Badge = ({ isIgnored, shortName, label, color }) => {
    return (
        <ChakraBadge
            color={isIgnored ? "fg.subtle" : ""}
            colorPalette={isIgnored ? "gray" : color}
            size={"xs"}
            variant={"surface"}
            title={label}
        >
            {shortName}
        </ChakraBadge>
    );
};
