import { Text, Card, Collapsible, Box, Flex, Button, AbsoluteCenter, Stack, StackSeparator, Code } from "@chakra-ui/react";
import {
    AccordionRoot,
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger
} from "../../components/ui/accordion";
import {
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTitle,
    PopoverTrigger,
} from "../../components/ui/popover";
import { ToggleTip, InfoTip } from "../../components/ui/toggle-tip";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "../../components/ResizebalePanel/ResizebalePanel.css";
import { headerMapping } from "./mappings";
import { LuChevronRight } from "react-icons/lu";
import { testData } from "./testData";

function ConnectionBase({protocol}) {
    const { "-indexName": _, "-name": __, ...rest } = protocol["protocol"];

    return (
        <Collapsible.Root unmountOnExit>
            <Box position={"relative"}>
                <Collapsible.Trigger w={"100%"} py={"2"} borderBottom={"1px solid"} borderColor={"border"}>
                    <Flex gap={"2"}>
                        <LuChevronRight />
                        <Text>{protocol["protocol"]["-indexName"]}</Text>
                        <Text>{protocol["protocol"]["-name"]}</Text>
                    </Flex>
                </Collapsible.Trigger>
                <AbsoluteCenter axis={"vertical"} insetEnd={"0"}>
                    <InfoTip>
                        <Flex direction={"column"}>
                            {
                                Object.keys(rest).map((key, index) => {
                                    return (
                                        <Text key={index}>{headerMapping[key]}: {rest[key].toString()}</Text>
                                    );
                                })
                            }
                        </Flex>
                    </InfoTip>
                </AbsoluteCenter>
            </Box>
            <Collapsible.Content>
                {
                    protocol["dataObjects"].map((dataObject, index) => {
                        return (
                            <Box key={index} borderBottom={"1px solid"} borderColor={"border"} h={"100%"} w={"100%"} p={"2"}>
                                Content: {JSON.stringify(dataObject)}
                            </Box>           
                        );
                    })
                }
            </Collapsible.Content>
        </Collapsible.Root>
    );
}

function HomePage() {
    return (
        <>
            <PanelGroup direction="horizontal">
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
                            {
                                testData["receive"]["connection"].map((connection, index) => {
                                    return (
                                        <ConnectionBase key={index} protocol={connection}/>
                                    );
                                })
                            }
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
                            <Card.Title>Переменные</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Text>Panel 2</Text>
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
                            <AccordionRoot variant={"outline"} collapsible multiple>
                                {
                                    testData.send.connection.map((connection, index) => (
                                        <AccordionItem key={index} value={connection["protocol"]["-indexName"]}>
                                            <Box position={"relative"}>
                                                <AccordionItemTrigger indicatorPlacement="start">
                                                    <ConnectionHeadder protocol={connection}/>
                                                </AccordionItemTrigger>
                                                <AbsoluteCenter axis={"vertical"} insetEnd={"0"}>
                                                    <ConnectionHeadderAdditionalInfo protocol={connection}/>
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
                        </Card.Body>
                    </Card.Root>
                </Panel>
            </PanelGroup>
        </>
    );
}



function ConnectionHeadder({protocol}) {
    return (
        <Flex gap={"2"} h={"100%"} w={"100%"}>
            <Stack direction={"row"} gap={"2"} w={"100%"} h={"100%"} separator={<StackSeparator />}>
                <Code size={"sm"}>{protocol["protocol"]["-name"]}</Code>
                <Text>{protocol["protocol"]["-indexName"]}</Text>
            </Stack>
        </Flex>
    );
}

function ConnectionHeadderAdditionalInfo({protocol}) {
    const { "-indexName": _, "-name": __, ...rest } = protocol["protocol"];

    return (
        <PopoverRoot positioning={{placement: "left-center"}}>
            <PopoverTrigger>
                <Button size={"xs"} variant={"subtle"}>...</Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverBody>
                    <Flex direction={"column"} wrap={"wrap"}>
                        {
                            Object.keys(rest).map((key, index) => {
                                return (
                                    <Text key={index} fontSize={"sm"} color={"fg.muted"}>{headerMapping[key]}: {rest[key].toString()}</Text>
                                );
                            })
                        }
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    );
}

export default HomePage;
