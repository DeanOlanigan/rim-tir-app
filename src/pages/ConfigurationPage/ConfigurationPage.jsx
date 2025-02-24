import { Box, Card, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "../../components/ResizebalePanel/ResizebalePanel.css";
import { config } from "../../config/testData";
import { ConfigurationEditor } from "./ConnectionEditor/ConfigurationEditor";
import { VariableMenu } from "./VariableEditor/VariableMenu";
import { useState } from "react";
import { AutoSizer } from "react-virtualized";
import { TreeView } from "./Tree/TreeView";
import { VariableCard } from "./TreeCard/VariableCard";
import { useVariablesStore } from "../../store/variables-store";

function ConfigurationPage() {
    console.log("Render ConfigurationPage");
    const [selectedNode, setSelectedNode] = useState();

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
                                    <Card.Title>Прием</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <AutoSizer>
                                        {({ height, width }) => (
                                            <TreeView
                                                height={height}
                                                width={width}
                                                data={
                                                    config.children[0].children
                                                }
                                                onSelect={(node) =>
                                                    setSelectedNode(node)
                                                }
                                            />
                                        )}
                                    </AutoSizer>
                                </Card.Body>
                            </Card.Root>
                        </Panel>
                        <PanelResizeHandle className="verticalLine" />
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
                                    <Card.Title>Передача</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <AutoSizer>
                                        {({ height, width }) => (
                                            <TreeView
                                                height={height}
                                                width={width}
                                                data={
                                                    config.children[1].children
                                                }
                                                onSelect={(node) =>
                                                    setSelectedNode(node)
                                                }
                                            />
                                        )}
                                    </AutoSizer>
                                </Card.Body>
                            </Card.Root>
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle className="verticalLine" />
                <Panel minSize={45}>
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
                                <Stack
                                    direction={"row"}
                                    separator={<StackSeparator />}
                                >
                                    <Text>{config.name}</Text>
                                    <Text>{config.setting.description}</Text>
                                    <Text>{config.setting.date}</Text>
                                    <Text>{config.setting.version}</Text>
                                </Stack>
                            </Card.Title>
                        </Card.Header>
                        <Card.Body overflow={"auto"} w={"100%"} h={"100%"}>
                            <PanelGroup direction="vertical">
                                <Panel
                                    collapsible
                                    collapsedSize={0}
                                    minSize={30}
                                >
                                    <Box w={"100%"} h={"100%"} pb={"2"}>
                                        <ConfigurationEditor
                                            data={selectedNode}
                                        />
                                    </Box>
                                </Panel>
                                <PanelResizeHandle className="verticalLineConf" />
                                <Panel
                                    //ref={panelRef}
                                    collapsible
                                    collapsedSize={0}
                                    minSize={30}
                                >
                                    <Box w={"100%"} h={"100%"} pt={"2"}>
                                        <VariableMenu />
                                    </Box>
                                </Panel>
                            </PanelGroup>
                        </Card.Body>
                    </Card.Root>
                </Panel>
                <PanelResizeHandle className="verticalLine" />
                <Panel
                    collapsible={true}
                    collapsedSize={0}
                    defaultSize={30}
                    minSize={15}
                >
                    <VariablesWrapper />
                </Panel>
            </PanelGroup>
        </Box>
    );
}

export default ConfigurationPage;

const VariablesWrapper = () => {
    const variables = useVariablesStore((state) => state.variables);
    return <VariableCard data={variables} type={"variables"} />;
};
