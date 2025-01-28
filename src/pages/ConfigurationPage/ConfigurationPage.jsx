import { Box, Flex, Text, Card } from "@chakra-ui/react";
import { Tree } from "react-arborist";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "../../components/ResizebalePanel/ResizebalePanel.css";

function ConfigurationPage() {

    const data = [
        {
            id: "1",
            name: "Прием",
            children: [
                { id: "c1", name: "General" },
                { id: "c2", name: "Random" },
                { id: "c3", name: "Open Source Projects" },
            ],
        },
        {
            id: "2",
            name: "Передача",
            children: [
                { id: "d1", name: "Alice" },
                { id: "d2", name: "Bob" },
                { id: "d3", name: "Charlie" },
            ],
        },
    ];

    return (
        <Box height="100%">
            <PanelGroup autoSaveId="persistence" direction="horizontal">
                <Panel collapsible={true} collapsedSize={0} minSize={9}>
                    <PanelGroup autoSaveId="persistence1" direction="vertical">
                        <Panel minSize={15}>
                            <Card.Root
                                size={"sm"}
                                h={"100%"}
                                data-state={"open"}
                                animationDuration={"slow"}
                                animationStyle={{
                                    _open: "scale-fade-in",
                                }}
                            >
                                <Card.Header>
                                    <Card.Title>
                                        <Flex align={"center"} justify={"space-between"}>
                                            <Text textStyle={"sm"}>Прием</Text>
                                        </Flex>
                                    </Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Flex height="100%">
                                        <Tree initialData={data}/>
                                    </Flex>
                                </Card.Body>
                            </Card.Root>
                        </Panel>
                        <PanelResizeHandle className="verticalLine"/>
                        <Panel minSize={15}>
                            <Card.Root
                                size={"sm"}
                                h={"100%"}
                                data-state={"open"}
                                animationDuration={"slow"}
                                animationStyle={{
                                    _open: "scale-fade-in",
                                }}
                            >
                                <Card.Header>
                                    <Card.Title>
                                        <Flex align={"center"} justify={"space-between"}>
                                            <Text textStyle={"sm"}>Передача</Text>
                                        </Flex>
                                    </Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Flex asChild height="100%" align="center" justify="center">
                                        <Text>ИО</Text>
                                    </Flex>
                                </Card.Body>
                            </Card.Root>
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle className="verticalLine"/>
                <Panel minSize={15}>
                    <Card.Root
                        h={"100%"}
                        size={"sm"}
                        data-state={"open"}
                        animationDuration={"slow"}
                        animationStyle={{
                            _open: "scale-fade-in",
                        }}
                    >
                        <Card.Header>
                            <Card.Title>
                                <Text textStyle={"sm"}>Конфигурация</Text>
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            
                        </Card.Body>
                    </Card.Root>
                </Panel>
                <PanelResizeHandle className="verticalLine"/>
                <Panel collapsible={true} collapsedSize={0} defaultSize={30} minSize={12}>
                    <Card.Root
                        h={"100%"}
                        size={"sm"}
                        data-state={"open"}
                        animationDuration={"slow"}
                        animationStyle={{
                            _open: "scale-fade-in",
                        }}
                    >
                        <Card.Header>
                            <Card.Title>
                                <Text textStyle={"sm"}>Переменные</Text>
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Flex asChild height="100%" align="center" justify="center">
                                <Text>Переменные</Text>
                            </Flex>
                        </Card.Body>
                    </Card.Root>
                </Panel>
            </PanelGroup>
        </Box>
    );
}

export default ConfigurationPage;
