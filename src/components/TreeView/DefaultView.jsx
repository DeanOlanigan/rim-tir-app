import { Stack, StackSeparator, Text, Code } from "@chakra-ui/react";
import { memo } from "react";
import {
    LuCable,
    LuUnplug,
    LuFolder,
    LuPackage,
    LuFileDigit,
    LuFileStack
} from "react-icons/lu";

const interfaceTypes = {
    rs485: "rs485",
    rs232: "RS232",
    iec104: "iec104",
};

const protocolTypes = {
    modbus: "Modbus",
    modbusRtu: "modbus-rtu",
    gpio: "gpio",
};

const nodeTypes = {
    interface: "interface",
    protocol: "protocol",
    folder: "folder",
    funcGroup: "functionGroup",
    dataObject: "dataObject",
    asdu: "asdu",
};

const markers = {
    [nodeTypes.interface]: <LuCable />,
    [nodeTypes.protocol]: <LuUnplug />,
    [nodeTypes.folder]: <LuFolder />,
    [nodeTypes.funcGroup]: <LuPackage />,
    [nodeTypes.dataObject]: <LuFileDigit />,
    [nodeTypes.asdu]: <LuFileStack />,
    [protocolTypes.modbus]: <Code colorPalette={"blue"}>{protocolTypes.modbus}</Code>,
    [protocolTypes.modbusRtu]: <Code colorPalette={"blue"}>{protocolTypes.modbus}</Code>,
    [protocolTypes.gpio]: <Code colorPalette={"green"}>{protocolTypes.gpio}</Code>,
    [interfaceTypes.rs485]: <Code colorPalette={"yellow"}>{interfaceTypes.rs485}</Code>,
    [interfaceTypes.rs232]: <Code colorPalette={"purple"}>{interfaceTypes.rs232}</Code>,
    [interfaceTypes.iec104]: <Code colorPalette={"red"}>{interfaceTypes.iec104}</Code>,
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
            { markers[type] }
            { type === nodeTypes.protocol || type === nodeTypes.interface ? markers[subType] : null }
            <Text>{setting?.name || subType || setting?.variable}</Text>
        </Stack>
    );
});
