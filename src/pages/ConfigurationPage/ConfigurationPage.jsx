import { Box, Flex, Text, Card } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AutoSizer } from "react-virtualized";
import "../../components/ResizebalePanel/ResizebalePanel.css";
import { TestMenuItems } from "./MenuItems";
import { config } from "../MonitoringPage/testData";
import { TreeView } from "../../components/TreeView/TreeView";
import { DefaultView } from "../../components/TreeView/DefaultView";
import { ConfigurationEditor } from "./ConfigurationEditor";
import { useState } from "react";

function ConfigurationPage() {
    console.log("Render ConfigurationPage");
    const [selectedNode, setSelectedNode] = useState(null);

    return (
        <Box height="100%">
            <PanelGroup autoSaveId="persistence" direction="horizontal">
                <Panel collapsible={true} collapsedSize={0} minSize={15}>
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
                                <Card.Body px={"1"} pb={"1"}>
                                    <AutoSizer>
                                        {({ height, width }) => (
                                            <TreeView
                                                height={height}
                                                width={width}
                                                data={config.children[0].children}
                                                /* MenuItems={<TestMenuItems />} */
                                                setNode={setSelectedNode}
                                            >
                                                <DefaultView />
                                            </TreeView>
                                        )}
                                    </AutoSizer>
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
                                <Card.Body px={"1"} pb={"1"}>
                                    <AutoSizer>
                                        {({ height, width }) => (
                                            <TreeView
                                                height={height}
                                                width={width}
                                                data={config.children[1].children}
                                                /* MenuItems={<TestMenuItems />} */
                                                setNode={setSelectedNode}
                                            >
                                                <DefaultView />
                                            </TreeView>
                                        )}
                                    </AutoSizer>
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
                        <Card.Body overflow={"auto"}>
                            <ConfigurationEditor data={selectedNode} />
                        </Card.Body>
                    </Card.Root>
                </Panel>
                <PanelResizeHandle className="verticalLine"/>
                <Panel collapsible={true} collapsedSize={0} defaultSize={30} minSize={15}>
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
                        <Card.Body px={"1"} pb={"1"}>
                            <AutoSizer>
                                {({ height, width }) => (
                                    <TreeView
                                        height={height}
                                        width={width}
                                        data={config.children[2].children}
                                        /* MenuItems={<TestMenuItems />} */
                                        setNode={setSelectedNode}
                                    >
                                        <DefaultView />
                                    </TreeView>
                                )}
                            </AutoSizer>
                        </Card.Body>
                    </Card.Root>
                </Panel>
            </PanelGroup>
        </Box>
    );
}

export default ConfigurationPage;
