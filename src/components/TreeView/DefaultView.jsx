import { Stack, StackSeparator, Text, Badge } from "@chakra-ui/react";
import { memo } from "react";
import {
    LuCable,
    LuUnplug,
    LuFolder,
    LuPackage,
    LuFileDigit,
    LuFileStack,
    LuVariable
} from "react-icons/lu";

const interfaceTypes = {
    rs485: "rs485",
    rs232: "rs232",
};

const protocolTypes = {
    modbus: "modbus",
    modbusRtu: "modbus-rtu",
    gpio: "gpio",
    iec104: "iec104",
};

const nodeTypes = {
    interface: "interface",
    protocol: "protocol",
    folder: "folder",
    funcGroup: "functionGroup",
    dataObject: "dataObject",
    asdu: "asdu",
};

const icons = {
    [nodeTypes.interface]: <LuCable />,
    [nodeTypes.protocol]: <LuUnplug />,
    [nodeTypes.folder]: <LuFolder />,
    [nodeTypes.funcGroup]: <LuPackage />,
    [nodeTypes.dataObject]: <LuFileDigit />,
    [nodeTypes.asdu]: <LuFileStack />,
    variable: <LuVariable />,
};

const modbusFunctionGroupTypes = {
    1: "read coils",
    2: "read discrete inputs",
    3: "read multiple holding registers",
    4: "read input registers",
    5: "write single coil",
    6: "write single holding register",
    7: "read exception status",
    8: "diagnostic",
    11: "get Com event counter",
    12: "get Com event log",
    15: "write multiple coils",
    16: "write multiple holding registers",
    17: "report slave ID",
    20: "read file record",
    21: "write file record",
    22: "mask write register",
    23: "read/write register",
    24: "read fifo queue",
    43: "read device identification",
};

const modbusFuncTypesBadges = Object.fromEntries(
    Object.entries(modbusFunctionGroupTypes).map(([key, value]) => [
        key, 
        <Badge key={key} colorPalette={"purple"}>{key}</Badge>
    ])
);

const badges = {
    [protocolTypes.modbus]: <Badge colorPalette={"blue"}>{protocolTypes.modbus}</Badge>,
    [protocolTypes.modbusRtu]: <Badge colorPalette={"blue"}>{protocolTypes.modbus}</Badge>,
    [protocolTypes.gpio]: <Badge colorPalette={"green"}>{protocolTypes.gpio}</Badge>,
    [protocolTypes.iec104]: <Badge colorPalette={"red"}>{protocolTypes.iec104}</Badge>,
    [interfaceTypes.rs485]: <Badge colorPalette={"yellow"}>{interfaceTypes.rs485}</Badge>,
    [interfaceTypes.rs232]: <Badge colorPalette={"purple"}>{interfaceTypes.rs232}</Badge>,
    [nodeTypes.asdu]: <Badge colorPalette={"teal"}>{nodeTypes.asdu}</Badge>,
    ...modbusFuncTypesBadges
};

export const DefaultView = memo(function DefaultView({type, subType, setting}) {
    console.log("Render DefaultView");

    return (
        <Stack
            h={"100%"}
            w={"100%"}
            direction={"row"}
            align={"center"}
            gap={"2"}
            separator={<StackSeparator height={"4"} alignSelf={"center"}/>}
        >
            { icons[type] }
            {
                type === nodeTypes.protocol ||
                type === nodeTypes.interface ||
                type === nodeTypes.funcGroup ||
                type === nodeTypes.asdu ?
                    badges[subType] || badges[type] : null 
            }
            <Text truncate>{setting?.name || setting?.variable}</Text>
        </Stack>
    );
});
