import { Box, Flex, Text, Card, Input, Button } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { AutoSizer } from "react-virtualized";
import "../../components/ResizebalePanel/ResizebalePanel.css";
import { TestMenuItems } from "./MenuItems";
import { config } from "../MonitoringPage/testData";
import { TreeView } from "../../components/TreeView/TreeView";
import { DefaultView } from "../../components/TreeView/DefaultView";
import { ConfigurationEditor } from "./ConfigurationEditor";
import { VariableMenu } from "./VariableMenu";
import { Connections } from "./Connections";
import { useEffect, useRef, useState } from "react";

function ConfigurationPage() {
    console.log("Render ConfigurationPage");
    const [selectedVariable, setSelectedVariable] = useState([]);
    const [test, setTest] = useState("");

    const panelRef = useRef(null);
    useEffect(() => {
        const panel = panelRef.current;
        if (panel && selectedVariable) {
            if (selectedVariable.length > 0) {
                panel.expand();
            } else {
                panel.collapse();
            }
        }
    }, [selectedVariable]);

    return (
        <Box height="100%">
            <PanelGroup autoSaveId="persistence" direction="horizontal">
                <Panel collapsible={true} collapsedSize={0} minSize={15}>
                    <Connections />
                </Panel>
                <PanelResizeHandle className="verticalLine"/>
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
                            <Card.Title>Конфигурация</Card.Title>
                        </Card.Header>
                        <Card.Body overflow={"auto"} w={"100%"} h={"100%"}>
                            <PanelGroup direction="vertical">
                                <Panel>
                                    <Box w={"100%"} h={"100%"} pb={"2"}>
                                        {/* <ConfigurationEditor data={selectedNode} /> */}
                                        <Input value={test} onChange={(e) => setTest(e.target.value)}/>
                                        <Button onClick={() => console.log(test)}>
                                            Test
                                        </Button>
                                    </Box>
                                </Panel>
                                <PanelResizeHandle className="verticalLineConf"/>
                                <Panel ref={panelRef} collapsible collapsedSize={0} minSize={40}>
                                    <VariableMenu selectedData={selectedVariable} setSelectedData={setSelectedVariable}/>
                                </Panel>
                            </PanelGroup>
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
                            <Card.Title>Переменные</Card.Title>
                        </Card.Header>
                        <Card.Body px={"1"} pb={"1"}>
                            {/* <AutoSizer>
                                {({ height, width }) => ( */}
                            <TreeView
                                /* height={height}
                                width={width} */
                                data={config.children[2].children}
                                /* MenuItems={<TestMenuItems />} */
                                setNode={setSelectedVariable}
                            >
                                <DefaultView />
                            </TreeView>
                            {/* )}
                            </AutoSizer> */}
                        </Card.Body>
                    </Card.Root>
                </Panel>
            </PanelGroup>
        </Box>
    );
}

export default ConfigurationPage;
