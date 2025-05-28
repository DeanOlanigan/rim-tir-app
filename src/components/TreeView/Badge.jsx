import { Badge as ChakraBadge } from "@chakra-ui/react";

export const Badge = ({ isIgnored, type }) => {
    const color = {
        modbus: "blue",
        "modbus-rtu": "blue",
        functionGroup: "yellow",
        gpio: "green",
        iec104: "red",
        comport: "purple",
        asdu: "teal",
        dataObject: "gray",
    };

    const shortName = {
        modbus: "MDB",
        "modbus-rtu": "MDB",
        functionGroup: "FG",
        gpio: "GPIO",
        iec104: "IEC104",
        comport: "COM",
        asdu: "ASDU",
    };

    if (!color[type] || !shortName[type]) {
        return null;
    }

    return (
        <ChakraBadge
            color={isIgnored ? "fg.subtle" : ""}
            colorPalette={isIgnored ? "gray" : color[type]}
        >
            {shortName[type]}
        </ChakraBadge>
    );
};
