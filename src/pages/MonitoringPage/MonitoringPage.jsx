import { Text, Card, Collapsible, Box, Flex, Button, AbsoluteCenter } from "@chakra-ui/react";
import { ToggleTip, InfoTip } from "../../components/ui/toggle-tip";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "../../components/ResizebalePanel/ResizebalePanel.css";
import { headerMapping } from "./mappings";
import { LuChevronRight } from "react-icons/lu";

const testData = {
    "variables": {
        "variable": [
            {
                "-id": "1",
                "-isSpecial": true,
                "-name": "test1",
                "-type": "1 бит – bool",
                "-isLua": true,
                "-description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero sit iure ea, odit nemo nobis non qua",
                "-cmd": true,
                "-archive": true,
                "-group": "Без группы",
                "-measurement": null,
                "-coefficient": "",
                "-luaExpression": "test2 = test2 + 1",
                "-specialCycleDelay": 5
            },
            {
                "-id": "2",
                "-isSpecial": false,
                "-name": "test2",
                "-type": "2 байта – целое",
                "-isLua": true,
                "-description": "",
                "-cmd": false,
                "-archive": false,
                "-group": "Без группы",
                "-measurement": null,
                "-coefficient": "",
                "-luaExpression": "test3 = cos(self())",
                "-specialCycleDelay": ""
            },
            {
                "-id": "3",
                "-isSpecial": false,
                "-name": "test3",
                "-type": "4 байта – с плавающей точкой",
                "-isLua": false,
                "-description": "",
                "-cmd": false,
                "-archive": true,
                "-group": "Без группы",
                "-measurement": null,
                "-coefficient": 1,
                "-luaExpression": "",
                "-specialCycleDelay": ""
            }
        ]
    },
    "send": {
        "connection": []
    },
    "receive": {
        "connection": [
            {
                "protocol": {
                    "-indexName": "testName2GPIO",
                    "-name": "GPIO",
                    "-isLog": true,
                    "-contactBounce": "200"
                },
                "dataObjects": [
                    {   
                        "dataObject": [
                            {
                                "-id": "1",
                                "-address": "1",
                                "-function": "OUT",
                                "-variable": "test1",
                                "-description": ""
                            }
                        ]
                    }
                ]
            },
            {
                "protocol": {
                    "-indexName": "modbus123",
                    "-name": "Modbus",
                    "-isLog": false,
                    "-deviceAddress": "1",
                    "-port": "ttyS0",
                    "-baudRate": "57600",
                    "-stopBit": "1",
                    "-parity": "None",
                    "-order2": "LittleEndian",
                    "-order4": "1-0 3-2",
                    "-pollPeriod": "21"
                },
                "dataObjects": [
                    {
                        "dataObject": [
                            {
                                "-id": "1",
                                "-address": "2",
                                "-function": "1",
                                "-variable": "test2",
                                "-type": "1 бит – bool",
                                "-description": ""
                            }
                        ]
                    }
                ]
            },
            {
                "protocol": {
                    "-indexName": "iec12",
                    "-name": "IEC 60870-5-104",
                    "-isLog": false,
                    "-isClient": false,
                    "-ipaddress": "0.0.0.0",
                    "-port": "12",
                    "-lengthOfASDU": "1",
                    "-lengthOfCause": "1",
                    "-lengthOfAdr": "1",
                    "-k": "1",
                    "-w": "1",
                    "-t0": "1",
                    "-t1": "1",
                    "-t2": "1",
                    "-t3": "1"
                },
                "dataObjects": [
                    {
                        "ASDU": [
                            {
                                "-id": "1",
                                "-asdu": "1",
                                "-isSporadically": false,
                                "-pollMode": "noPoll",
                                "-pollPeriod": "",
                                "dataObject": [
                                    {
                                        "-id": "1",
                                        "-address": "12",
                                        "-variable": "test3",
                                        "-type": "Однопозиционный ТС",
                                        "-aperture": null,
                                        "-exec": "",
                                        "-description": ""
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

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
                        {
                            Object.keys(rest).map((key, index) => {
                                return (
                                    <Text key={index}>{headerMapping[key]}: {rest[key].toString()}</Text>
                                );
                            })
                        }
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
                            <Text>Panel 3</Text>
                        </Card.Body>
                    </Card.Root>
                </Panel>
            </PanelGroup>
        </>
    );
}

export default HomePage;
