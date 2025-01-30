import { Text, Card, Box, Flex, IconButton, AbsoluteCenter, Stack, StackSeparator, Code, Mark, Table, Collapsible } from "@chakra-ui/react";
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
import { testData, config } from "./testData";
import { LuCircle, LuInfo, LuLightbulb, LuPencil, LuUserCheck, LuFolder } from "react-icons/lu";

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
                            <ConnectionBase protocol={testData.receive} />
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
                            <VariablesTable variables={config.children[2]}/>
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
                            <ConnectionBase protocol={testData.send} />
                        </Card.Body>
                    </Card.Root>
                </Panel>
            </PanelGroup>
        </>
    );
}

function VariablesTable({variables}) {
    return (
        <Table.Root size={"sm"}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader w={"40px"}/>
                    <Table.ColumnHeader w={"40px"}/>
                    <Table.ColumnHeader w={"100%"}>Переменная</Table.ColumnHeader>
                    <Table.ColumnHeader w={"100%"}>Значение</Table.ColumnHeader>
                    <Table.ColumnHeader w={"40px"}/>
                    <Table.ColumnHeader w={"40px"}/>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    variables.children.map((variable, index) => (
                        variable.type === "folder" 
                            ? <VariableFolder key={index} folder={variable}/>
                            : <VariableTableRow key={index} variable={variable}/>
                    ))
                }
            </Table.Body>
        </Table.Root>
    );
}

function VariableFolder({folder}) {
    return (
        <Table.Row w={"100%"}>
            <Table.Cell colSpan={6} px={"0"} py={"1"}>
                <Collapsible.Root w={"100%"}>
                    <Collapsible.Trigger w={"100%"} asChild>
                        <IconButton size={"xs"} variant={"ghost"}>
                            <LuFolder />
                        </IconButton>
                    </Collapsible.Trigger>
                    <Collapsible.Content w={"100%"}>
                        <Table.Root size={"sm"}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader />
                                    <Table.ColumnHeader />
                                    <Table.ColumnHeader minW={"40px"}></Table.ColumnHeader>
                                    <Table.ColumnHeader></Table.ColumnHeader>
                                    <Table.ColumnHeader />
                                    <Table.ColumnHeader />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    folder.children.map((variable, index) => (
                                        variable.type === "folder" 
                                            ? <VariableFolder key={index} folder={variable}/> 
                                            : <VariableTableRow key={index} variable={variable}/>
                                    ))
                                }
                            </Table.Body>
                        </Table.Root>
                    </Collapsible.Content>
                </Collapsible.Root>
            </Table.Cell>
        </Table.Row>
    );
}

function VariableTableRow({variable}) {
    return (
        <Table.Row>
            <Table.Cell><LuLightbulb/></Table.Cell>
            <Table.Cell><LuCircle/></Table.Cell>
            <Table.Cell w={"100%"}>
                <Stack
                    direction={"row"}
                    gap={"1"}
                    align={"center"}
                >
                    <Text truncate fontSize={"sm"} fontWeight={"medium"}>{variable.setting.name}</Text>
                    <ConnectionHeadderAdditionalInfo protocol={variable.setting}/>
                </Stack>
            </Table.Cell>
            <Table.Cell w={"100%"}><Code variant={"surface"}></Code></Table.Cell>
            <Table.Cell>
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
            <Table.Cell><LuUserCheck/></Table.Cell>
        </Table.Row>
    );
}

function ConnectionBase({protocol}) {
    return (
        <AccordionRoot variant={"outline"} collapsible multiple>
            {
                protocol.connection.map((connection, index) => (
                    <AccordionItem key={index} value={connection["protocol"]["-indexName"]}>
                        <Box position={"relative"}>
                            <AccordionItemTrigger indicatorPlacement="start">
                                <ConnectionHeadder protocol={connection}/>
                            </AccordionItemTrigger>
                            <AbsoluteCenter axis={"vertical"} insetEnd={"0"}>
                                <ConnectionHeadderAdditionalInfo protocol={connection["protocol"]}/>
                            </AbsoluteCenter>
                        </Box>
                        <AccordionItemContent>
                            {
                                connection["dataObjects"].map((dataObject, index) => {
                                    return (
                                        <Box key={index} h={"100%"} w={"100%"} p={"2"}>
                                            Content: {JSON.stringify(dataObject)}
                                        </Box>           
                                    );
                                })
                            }
                        </AccordionItemContent>
                    </AccordionItem>
                ))
            }
        </AccordionRoot>
    );
}

function ConnectionHeadder({protocol}) {
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
                {protocol["protocol"]["-name"]}
            </Code>
            <Text
                truncate
                fontSize={"sm"}
            >
                {protocol["protocol"]["-indexName"]}
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

export default HomePage;
