import { Text, Code, Icon, Stack, StackSeparator, IconButton } from "@chakra-ui/react";
import { Tree } from "react-arborist";
import { LuChevronRight, LuChevronDown, LuFolder, LuCable, LuUnplug, LuPackage, LuFileDigit, LuFileStack, LuPlus, LuTrash2, LuPencil } from "react-icons/lu";
import {
    MenuContent,
    MenuContextTrigger,
    MenuTriggerItem,
    MenuItem,
    MenuRoot,
} from "../../components/ui/menu";

const interfaceTypes = {
    rs485: "RS485",
    rs232: "RS232",
    iec104: "IEC104",
};

const protocolTypes = {
    modbus: "Modbus",
    gpio: "GPIO",
};

const nodeTypes = {
    interface: "interface",
    protocol: "protocol",
    folder: "folder",
    funcGroup: "funcGroup",
    dataObject: "dataObject",
    asdu: "asdu",
};

const data = [
    {
        id: "1", type: nodeTypes.interface, name: "USER:RS485", 
        settings: { type: interfaceTypes.rs485, parent: "1", /* other settings */ },
        children: 
        [
            {
                id: "2", type: nodeTypes.protocol, name: "USER:Modbus",
                settings: { type: protocolTypes.modbus, parent: "2", /* other settings */ },
                children: 
                [
                    {
                        id: "d1", type: nodeTypes.folder, name: "USER:Alice",
                        settings: {},
                        children:
                        [
                            { id: "d3", type: nodeTypes.funcGroup, name: "USER:funcGroup" , settings: {}, children: 
                                [
                                    { id: "e3", type: nodeTypes.dataObject, name: "VAR", settings: {} },
                                    { id: "e4", type: nodeTypes.dataObject, name: "VAR", settings: {} },
                                ]
                            },
                        ]
                    },
                    { id: "d2", type: nodeTypes.funcGroup, name: "USER:funcGroup" , settings: {}, children: 
                        [
                            { id: "e1", type: nodeTypes.dataObject, name: "VAR", settings: {} },
                            { id: "e2", type: nodeTypes.dataObject, name: "VAR", settings: {} },
                        ] 
                    },
                ],
            },      
        ],
    },
    {
        id: "3", type: nodeTypes.interface, name: "USER:IEC104", 
        settings: { type: interfaceTypes.iec104, parent: "3", /* other settings */ },
        children: 
        [
            { 
                id: "a1", type: nodeTypes.asdu, name: "USER:Alice", settings: {}, children:
                [
                    { id: "b1", type: nodeTypes.dataObject, name: "VAR", settings: {} },
                ]
            },
        ],
    },
    { 
        id: "c1", type: nodeTypes.interface, name: "USER:GPIO",
        settings: { type: protocolTypes.gpio, /* other settings */ },
        children: 
        [
            { 
                id: "h1", type: nodeTypes.dataObject, name: "VAR",
                settings: {} 
            },
            { 
                id: "h2", type: nodeTypes.dataObject, name: "VAR",
                settings: {} 
            },
            { 
                id: "h3", type: nodeTypes.dataObject, name: "VAR",
                settings: {}  
            },
        ]
    },
];

const markers = {
    [nodeTypes.interface]: <LuCable />,
    [nodeTypes.protocol]: <LuUnplug />,
    [nodeTypes.folder]: <LuFolder />,
    [nodeTypes.funcGroup]: <LuPackage />,
    [nodeTypes.dataObject]: <LuFileDigit />,
    [nodeTypes.asdu]: <LuFileStack />,
    [protocolTypes.modbus]: <Code colorPalette={"blue"}>{protocolTypes.modbus}</Code>,
    [protocolTypes.gpio]: <Code colorPalette={"green"}>{protocolTypes.gpio}</Code>,
    [interfaceTypes.rs485]: <Code colorPalette={"yellow"}>{interfaceTypes.rs485}</Code>,
    [interfaceTypes.rs232]: <Code colorPalette={"purple"}>{interfaceTypes.rs232}</Code>,
    [interfaceTypes.iec104]: <Code colorPalette={"red"}>{interfaceTypes.iec104}</Code>,
};

function TreeView({ height, width }) {
    return (
        <Tree
            initialData={data}
            openByDefault={false}
            height={height}
            width={width}
            overscanCount={2}
            rowHeight={40}
            indent={32} // Отступ вложенных узлов
        >
            {BaseNode}
        </Tree>
    );
};
export default TreeView;

function BaseNode({ node, style, dragHandle, tree, preview }) {
    const { name, type, settings } = node.data;
    return (
        <Stack
            style={style}
            ref={dragHandle}
            borderBottom={"1px solid"}
            borderColor={"border.emphasized"}
            h={"100%"}
            w={"calc(100% - 16px)"}
            direction={"row"}
            align={"center"}
            gap={"4"}
            py={"2"}
            onContextMenu={(e) => e.preventDefault()}
        >
            {
                node.isLeaf 
                    ? null
                    : 
                    (
                        <IconButton size={"xs"} variant={"ghost"} onClick={() => node.toggle()}>
                            { node.isOpen ? <LuChevronDown/> : <LuChevronRight/> }
                        </IconButton>
                    )
            }
            <MenuRoot>
                <MenuContextTrigger>
                    <Stack
                        h={"100%"}
                        w={"100%"}
                        direction={"row"}
                        align={"center"}
                        gap={"2"}
                        separator={<StackSeparator />}
                    >
                        { markers[type] }
                        { type === nodeTypes.protocol || type === nodeTypes.interface ? markers[settings?.type] : null }
                        <Text>{name}</Text>
                    </Stack>
                </MenuContextTrigger>
                <MenuContent>
                    <MenuItem value="add">
                        <LuPlus />
                        Добавить узел
                    </MenuItem>
                    <MenuRoot positioning={{ placement: "right-start", gutter: 2 }}>
                        <MenuTriggerItem>
                            <LuPencil />
                            Редактировать узел
                        </MenuTriggerItem>
                        <MenuContent>
                            <MenuItem value="rename">
                                <LuPencil />
                                Переименовать узел
                            </MenuItem>
                            <MenuItem value="delete">
                                <LuTrash2 />
                                Удалить узел
                            </MenuItem>
                        </MenuContent>
                    </MenuRoot>
                    <MenuItem value="delete">
                        <LuTrash2 />
                        Удалить узел
                    </MenuItem>
                    <MenuItem value="rename">
                        <LuPencil />
                        Переименовать узел
                    </MenuItem>
                </MenuContent>
            </MenuRoot>
        </Stack>
    );
};
