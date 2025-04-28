import { Badge as ChakraBadge } from "@chakra-ui/react";

export const Badge = ({ isIgnored, type, id }) => {
    const color = {
        modbus: "blue",
        "modbus-rtu": "blue",
        functionGroup: "yellow",
        gpio: "green",
        iec104: "red",
        rs485: "purple",
        rs232: "purple",
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
        rs485: "RS485",
        rs232: "RS232",
        comport: "COM",
        asdu: "ASDU",
        dataObject: id.slice(0, 8),
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
