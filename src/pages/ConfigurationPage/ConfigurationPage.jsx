import { Box, Flex, Text, Card, Input, Button } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "../../components/ResizebalePanel/ResizebalePanel.css";
import { TestMenuItems } from "./Tree/MenuItems";
import { config } from "../MonitoringPage/testData";
import { ConfigurationEditor } from "./ConfigurationEditor";
import { VariableMenu } from "./VariableMenu";
import { useCallback, useEffect, useRef, useState } from "react";
import { ConfigurationCard } from "./ConfigurationCard";

function ConfigurationPage() {
    console.log("Render ConfigurationPage");
    const [selectedVariable, setSelectedVariable] = useState();
    const [test, setTest] = useState("");

    const panelRef = useRef(null);
    useEffect(() => {
        console.log("SELECTED VARIABLE", selectedVariable);
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
                    {/* <Connections /> */}
                    <PanelGroup autoSaveId="persistence1" direction="vertical">
                        <Panel minSize={15}>
                            {/* <SendCard selectedNode={selectedNode} setSelectedNode={setSelectedNode}/> */}
                            <ConfigurationCard title={"Прием"} data={config.children[0].children}/>
                        </Panel>
                        <PanelResizeHandle className="verticalLine"/>
                        <Panel minSize={15}>
                            {/* <ReceiveCard selectedNode={selectedNode} setSelectedNode={setSelectedNode}/> */}
                            <ConfigurationCard title={"Передача"} data={config.children[1].children}/>
                        </Panel>
                    </PanelGroup>
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
                    <ConfigurationCard 
                        title={"Переменные"} 
                        data={config.children[2].children}
                        setSelectedData={useCallback((node) => 
                            setSelectedVariable(node), [])}
                    />
                </Panel>
            </PanelGroup>
        </Box>
    );
}

export default ConfigurationPage;
