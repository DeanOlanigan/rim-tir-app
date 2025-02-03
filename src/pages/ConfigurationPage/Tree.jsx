import { Text, Code, Icon, Stack, StackSeparator, Separator, IconButton, MenuTrigger, Button, Box } from "@chakra-ui/react";
import { Tree } from "react-arborist";
import { LuChevronRight, LuChevronDown, LuFolder, LuCable, LuUnplug, LuPackage, LuFileDigit, LuFileStack, LuPlus, LuTrash2, LuPencil, LuEllipsis } from "react-icons/lu";
import {
    MenuContent,
    MenuContextTrigger,
    MenuTriggerItem,
    MenuItem,
    MenuRoot,
} from "../../components/ui/menu";
import { motion, AnimatePresence } from "motion/react";
import { memo, useEffect, useState } from "react";
import styles from "./tree.module.css";
import clsx from "clsx";

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

const data1 = [
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
    [protocolTypes.modbusRtu]: <Code colorPalette={"blue"}>{protocolTypes.modbus}</Code>,
    [protocolTypes.gpio]: <Code colorPalette={"green"}>{protocolTypes.gpio}</Code>,
    [interfaceTypes.rs485]: <Code colorPalette={"yellow"}>{interfaceTypes.rs485}</Code>,
    [interfaceTypes.rs232]: <Code colorPalette={"purple"}>{interfaceTypes.rs232}</Code>,
    [interfaceTypes.iec104]: <Code colorPalette={"red"}>{interfaceTypes.iec104}</Code>,
};

function TreeView({height, width, data}) {
    const onFocus = (node) => {
        console.log(node);
    };

    return (
        <Tree
            initialData={data}
            openByDefault={false}
            overscanCount={2}
            rowHeight={32}
            indent={32} // Отступ вложенных узлов
            height={height}
            width={width}
            onFocus={onFocus}
            renderCursor={DropCursor}
        >
            {BaseNode}
        </Tree>
    );
};
export default TreeView;

const NodeContext = memo(function NodeContext() {
    console.log("Render NodeContext");
    return (
        <MenuRoot lazyMount unmountOnExit>
            <MenuTrigger asChild>
                <IconButton
                    size={"xs"}
                    variant={"ghost"}
                    position={"absolute"}
                    right={0}
                >
                    <LuEllipsis />
                </IconButton>
            </MenuTrigger>
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
    );
});

const NodeContent = memo(function NodeContent(props) {
    console.log("Render NodeContent");
    const { node, dragHandle, style } = props;
    const { type, subType, setting } = node.data;
    return (
        <Stack
            direction={"row"}
            gap={"4"}
            align={"center"}
            onContextMenu={(e) => e.preventDefault()}
            ref={dragHandle}
            style={style}
            w={"calc(100% - 32px)"}
            h={"100%"}
            onClick={() => {
                node.toggle();
            }}
        >
            {
                node.isLeaf 
                    ? null
                    : 
                    (
                        <Box
                            w={"19.19px"}
                            h={"19.19px"}
                            color={"fg.subtle"}
                            as={LuChevronRight}
                            transform={node.isOpen ? "rotate(90deg)" : "rotate(0deg)"}
                            transition={"transform 0.2s ease-in-out"}
                        />
                    )
            }
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
        </Stack>
    );
});

function DropCursor({top, left}) {
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

const BaseNode = memo(function BaseNode(props) {
    console.log("Render BaseNode");
    const { node, style, dragHandle, tree, preview } = props;
    
    return (
        <AnimatePresence mode="popLayout">
            <motion.div
                
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: -20, scale: 0 }}
                transition={{ duration: 0.2 }}
                /* style={{
                    display: "flex",
                    alignContent: "center",
                    height: "100%",
                    borderBottom: "1px solid",
                    bordercolor: "black",
                }} */
                className={clsx(styles.node, node.state)}
            >
                <NodeContent
                    node={node}
                    style={style}
                    dragHandle={dragHandle}
                    tree={tree}
                    preview={preview}
                />
                <NodeContext/>
            </motion.div>
        </AnimatePresence>
    );
});
