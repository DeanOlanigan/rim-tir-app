import React, { useState } from "react";
import { Text, Card, Box, Flex, IconButton, AbsoluteCenter, Stack, StackSeparator, Code, Mark, Table, Collapsible, Button, Badge, Presence } from "@chakra-ui/react";
import {
    AccordionRoot,
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger
} from "../../components/ui/accordion";
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "../../components/ui/menu";
import { Field } from "../../components/ui/field";
import {
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTrigger,
} from "../../components/ui/popover";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "../../components/ResizebalePanel/ResizebalePanel.css";
import { headerMapping, valueMapping } from "./mappings";
import { config } from "./testData";
import { LuCircle,
    LuInfo,
    LuLightbulb,
    LuPencil,
    LuUserCheck,
    LuFolder,
    LuChevronLeft,
    LuChevronDown,
    LuChevronRight,
    LuCable,
    LuUnplug
} from "react-icons/lu";
import { AutoSizer } from "react-virtualized";
import { TreeView } from "../../components/TreeView/TreeView";
import { TestNode } from "../ConfigurationPage/tree";
import { VariableNode } from "./VariableNode";

function HomePage() {
    return (
        <>
            <PanelGroup direction="horizontal" autoSaveId={"monitoring"}>
                <Panel collapsible={true} collapsedSize={0} minSize={25}>
                    <Card.Root
                        h={"100%"}
                        data-state={"open"}
                        animationDuration={"slow"}
                        animationStyle={{
                            _open: "scale-fade-in",
                        }}
                    >
                        <Card.Header>
                            <Card.Title>Прием</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <AutoSizer>
                                {({ height, width }) => (
                                    <TreeView
                                        height={height}
                                        width={width}
                                        data={config.children[0].children}
                                        disableDrag
                                    >
                                        <VariableNode />
                                    </TreeView>
                                )}
                            </AutoSizer>
                        </Card.Body>
                    </Card.Root>
                </Panel>
                <PanelResizeHandle className="verticalLine"/>
                <Panel collapsible={true} collapsedSize={0} minSize={35}>
                    <Card.Root 
                        h={"100%"}
                        data-state={"open"}
                        animationDuration={"slow"}
                        animationStyle={{
                            _open: "scale-fade-in",
                        }}
                    >
                        <Card.Header>
                            <Card.Title>Переменные</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <AutoSizer>
                                {({ height, width }) => (
                                    <TreeView
                                        height={height}
                                        width={width}
                                        data={config.children[2].children}
                                        disableDrag
                                    >
                                        <VariableNode editable={true} />
                                    </TreeView>
                                )}
                            </AutoSizer>
                        </Card.Body>
                    </Card.Root>
                </Panel>
                <PanelResizeHandle className="verticalLine"/>
                <Panel collapsible={true} collapsedSize={0} minSize={25}>
                    <Card.Root
                        h={"100%"}
                        data-state={"open"}
                        animationDuration={"slow"}
                        animationStyle={{
                            _open: "scale-fade-in",
                        }}
                    >
                        <Card.Header>
                            <Card.Title>Передача</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <AutoSizer>
                                {({ height, width }) => (
                                    <TreeView
                                        height={height}
                                        width={width}
                                        data={config.children[1].children}
                                        disableDrag
                                    >
                                        <VariableNode />
                                    </TreeView>
                                )}
                            </AutoSizer>
                        </Card.Body>
                    </Card.Root>
                </Panel>
            </PanelGroup>
        </>
    );
}

function TableFolder({item, level, isExpanded, toggleExpand, isEditable}) {
    const iconMap = {
        "folder": <LuFolder/>,
        "asdu": <LuCable/>,
        "functionGroup": <LuUnplug/>
    };

    const badgePallete = {
        "folder": "blue",
        "asdu": "yellow",
        "functionGroup": "green"
    };

    return (
        <Table.Row border={0} background={"bg.muted"}>
            <Table.Cell pl={level * 6}border={"none"}>
                <Box p={"2"}>
                    <IconButton size={"xs"} variant={"plain"} onClick={() => toggleExpand(item.id)}>
                        {/* {isExpanded ? <LuChevronDown /> : <LuChevronRight />} */}
                        <Box
                            w={"19.19px"}
                            h={"19.19px"}
                            color={"fg.subtle"}
                            as={LuChevronRight}
                            transform={isExpanded ? "rotate(90deg)" : "rotate(0deg)"}
                            transition={"transform 0.2s ease-in-out"}
                        />
                    </IconButton>
                </Box>
            </Table.Cell>
            <Table.Cell colSpan={isEditable ? 7 : 4} border={"none"}>
                <Flex align={"center"}>
                    <Stack w={"100%"} direction={"row"} align={"center"} justifyContent={"center"} separator={<StackSeparator />}>
                        <Badge colorPalette={badgePallete[item.type]}>
                            {iconMap[item.type]}
                            <Text>{item.setting.name || item.subType || item.type}</Text>
                        </Badge>
                        <Text>{item.setting.description}</Text>
                        <Code colorPalette={"red"}>{item.setting.group}</Code>
                    </Stack>
                </Flex>
            </Table.Cell>
        </Table.Row>
    );
}

function TableEndRow({item, level, isEditable}) {
    return (
        <Table.Row>
            <Table.Cell pl={level * 6} pe={"0"} border={"none"}>
                
            </Table.Cell>
            <Table.Cell border={"none"}>
                <LuLightbulb/>
            </Table.Cell>
            <Table.Cell border={"none"}>
                <LuCircle/>
            </Table.Cell>
            <Table.Cell border={"none"}>
                <Flex align={"center"} gap={"2"}>
                    <Text truncate fontSize={"sm"} fontWeight={"medium"}>{item.setting.name || item.setting.variable}</Text>
                    <ConnectionHeadderAdditionalInfo protocol={item.setting}/>
                </Flex>
            </Table.Cell>
            <Table.Cell border={"none"}>
                <Code w={"100%"}></Code>
            </Table.Cell>
            {isEditable && (
                <>
                    <Table.Cell border={"none"}>
                        <MenuRoot>
                            <MenuTrigger asChild>
                                <IconButton size={"xs"} variant={"ghost"}>
                                    <LuPencil/>
                                </IconButton>
                            </MenuTrigger>
                            <MenuContent>
                                <MenuItem>Редактировать</MenuItem>
                            </MenuContent>
                        </MenuRoot>
                    </Table.Cell>
                    <Table.Cell border={"none"}>
                        <LuUserCheck/>
                    </Table.Cell>
                    <Table.Cell border={"none"}>
                        
                    </Table.Cell>
                </>    
            )}
        </Table.Row>
    );
}

function ConnectionBase({protocol}) {
    return (
        <AccordionRoot variant={"outline"} collapsible multiple lazyMount unmountOnExit>
            {
                protocol.map((connection, index) => (

                    connection.type === "interface" ? <ConnectionBase key={index} protocol={connection.children}/> :
                        (
                            <AccordionItem key={index} value={connection.id}>
                                <Box position={"relative"}>
                                    <AccordionItemTrigger indicatorPlacement="start">
                                        <ConnectionHeadder protocol={connection.subType} name={connection.setting.name}/>
                                    </AccordionItemTrigger>
                                    <AbsoluteCenter axis={"vertical"} insetEnd={"0"}>
                                        <ConnectionHeadderAdditionalInfo protocol={connection.setting}/>
                                    </AbsoluteCenter>
                                </Box>
                                <AccordionItemContent>
                                    {/* {
                                        connection["dataObjects"].map((dataObject, index) => {
                                            return (
                                                <Box key={index} h={"100%"} w={"100%"} p={"2"}>
                                                    Content: {JSON.stringify(dataObject)}
                                                </Box>           
                                            );
                                        })
                                    } */}
                                    <CollapsibleFoldersTable data={connection.children}/>
                                </AccordionItemContent>
                            </AccordionItem>
                        )
                ))
            }
        </AccordionRoot>
    );
}

function ConnectionHeadder({protocol, name}) {
    return (
        <Stack 
            direction={"row"}
            gap={"2"}
            w={"calc(100% - 40px)"}
            h={"100%"}
            separator={<StackSeparator />}
        >
            <Code
                size={"sm"}
                textWrap={"nowrap"}
            >
                {protocol}
            </Code>
            <Text
                truncate
                fontSize={"sm"}
            >
                {name}
            </Text>
        </Stack>
    );
}

function ConnectionHeadderAdditionalInfo({protocol}) {
    const { "-indexName": _, name: __, id: ___, ...rest } = protocol;

    return (
        <PopoverRoot positioning={{placement: "left-center"}} lazyMount unmountOnExit>
            <PopoverTrigger asChild>
                <IconButton size={"xs"} variant={"ghost"}>
                    <LuInfo />
                </IconButton>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverBody>
                    <Stack gap={"1"} separator={<StackSeparator />}>
                        {
                            Object.keys(rest).map((key, index) => {
                                return (
                                    {/* <Flex key={index} justifyContent={"space-between"} maxH={"50px"}>
                                        <Text fontSize={"sm"} color={"fg.muted"}>
                                            {headerMapping[key]}:
                                        </Text>
                                        <Text fontSize={"sm"} textAlign={"end"} truncate lineClamp={"3"}>
                                            <Mark variant={"text"}> {rest[key]}</Mark>
                                        </Text>
                                    </Flex> */},
                                    <Field key={index} label={headerMapping[key]}>
                                        <Box maxH={"100px"} overflow={"auto"}>
                                            <Text fontSize={"sm"}>{valueMapping[rest[key]] || rest[key].toString()}</Text>
                                        </Box>
                                    </Field>
                                );
                            })
                        }
                    </Stack>
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    );
}

function CollapsibleFoldersTable({data, isEditable = false}) {
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const renderRows = (items, level = 0) => {
        return items.map((item) => {
            const isFolder = item.type === "folder" || item.type === "asdu" || item.type === "functionGroup";
            const isExpanded = expanded[item.id];

            return (
                <React.Fragment key={item.id}>
                    {isFolder ? 
                        (<TableFolder
                            item={item}
                            level={level}
                            isExpanded={isExpanded}
                            toggleExpand={toggleExpand}
                            isEditable={isEditable}
                        />) : (<TableEndRow item={item} level={level} isEditable={isEditable}/>)
                    }

                    { isFolder && isExpanded && item.children && (
                        // TODO Рендер с анимацией в таблице - это пиздец.
                        renderRows(item.children, level + 1)
                    )}
                </React.Fragment>
            );
        });
    };

    return (
        <Table.ScrollArea w={"100%"}>
            <Table.Root w={"100%"} textAlign={"center"} size={"sm"} borderBottom={"1px solid"} borderColor={"border"}>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader w={"1px"}/>
                        <Table.ColumnHeader w={"40px"}/>
                        <Table.ColumnHeader w={"40px"}/>
                        <Table.ColumnHeader>Переменная</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign={"center"}>Значение</Table.ColumnHeader>
                        {isEditable && (
                            <>
                                <Table.ColumnHeader w={"40px"}/>
                                <Table.ColumnHeader w={"40px"}/>
                                <Table.ColumnHeader w={"40px"}/>
                            </>
                        )}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {renderRows(data)}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
}

export default HomePage;
