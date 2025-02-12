import { Box, Card } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "../../components/ResizebalePanel/ResizebalePanel.css";
import { config } from "../MonitoringPage/testData";
import { ConfigurationEditor } from "./ConnectionEditor/ConfigurationEditor";
import { VariableMenu } from "./VariableMenu";
import { useCallback, useEffect, useRef, useState } from "react";
import { ConfigurationCard } from "./ConfigurationCard";

function ConfigurationPage() {
    console.log("Render ConfigurationPage");
    const [selectedNode, setSelectedNode] = useState();
    const [selectedVariable, setSelectedVariable] = useState();

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
                    <PanelGroup autoSaveId="persistence1" direction="vertical">
                        <Panel minSize={15}>
                            <ConfigurationCard
                                title={"Прием"}
                                data={config.children[0].children}
                                setSelectedData={useCallback((node) => 
                                    setSelectedNode(node), [])}
                            />
                        </Panel>
                        <PanelResizeHandle className="verticalLine"/>
                        <Panel minSize={15}>
                            <ConfigurationCard
                                title={"Передача"}
                                data={config.children[1].children}
                                setSelectedData={useCallback((node) => 
                                    setSelectedNode(node), [])}
                            />
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
                                <Panel collapsible collapsedSize={0} minSize={30}>
                                    <Box w={"100%"} h={"100%"} pb={"2"}>
                                        <ConfigurationEditor data={selectedNode} />
                                    </Box>
                                </Panel>
                                <PanelResizeHandle className="verticalLineConf"/>
                                <Panel ref={panelRef} collapsible collapsedSize={0} minSize={30}>
                                    <Box w={"100%"} h={"100%"} pt={"2"}>
                                        <VariableMenu selectedData={selectedVariable} setSelectedData={setSelectedVariable}/>
                                    </Box>
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
