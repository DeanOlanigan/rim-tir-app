import { Text, Code, Stack, StackSeparator, Box } from "@chakra-ui/react";
import { Tree } from "react-arborist";
import {
    LuChevronRight,
    LuFolder,
    LuCable,
    LuUnplug,
    LuPackage,
    LuFileDigit,
    LuFileStack,
    LuPlus,
    LuTrash2,
    LuPencil,
    LuEllipsis
} from "react-icons/lu";
import {
    MenuContent,
    MenuContextTrigger,
    MenuTriggerItem,
    MenuItem,
    MenuRoot,
} from "../../components/ui/menu";
import { motion, AnimatePresence } from "motion/react";
import { memo } from "react";
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

export const TreeView = ({height, width, data}) => {
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

const NodeContext = memo(function NodeContext(props) {
    console.log("Render NodeContext");
    const { node, dragHandle, style, tree, preview } = props;

    return (
        <MenuRoot lazyMount unmountOnExit>
            <MenuContextTrigger w={"100%"}>
                {/* <IconButton
                    size={"xs"}
                    variant={"ghost"}
                    position={"absolute"}
                    right={0}
                >
                    <LuEllipsis />
                </IconButton> */}
                <NodeContent
                    node={node}
                    dragHandle={dragHandle}
                    style={style}
                    tree={tree}
                    preview={preview}
                />
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
    );
});

export const NodeContent = memo(function NodeContent(props) {
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
                {/* <NodeContent
                    node={node}
                    style={style}
                    dragHandle={dragHandle}
                    tree={tree}
                    preview={preview}
                /> */}
                <NodeContext
                    node={node}
                    style={style}
                    dragHandle={dragHandle}
                    tree={tree}
                    preview={preview}
                />
            </motion.div>
        </AnimatePresence>
    );
});

export const TestMenuItems = () => {
    return (
        <>
            <MenuItem value="add">
                <LuPlus />
                Добавить узел
            </MenuItem>
            <MenuItem value="rename">
                <LuPencil />
                Переименовать узел
            </MenuItem>
            <MenuItem value="delete">
                <LuTrash2 />
                Удалить узел
            </MenuItem>
        </>
    );
};

export const TestNode = ({type, subType, setting}) => {
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
};
