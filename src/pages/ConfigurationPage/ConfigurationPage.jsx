import { Box, Card, Button, Text } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "../../components/ResizebalePanel/ResizebalePanel.css";
import { config } from "../../config/testData";
import { ConfigurationEditor } from "./ConnectionEditor/ConfigurationEditor";
import { VariableMenu } from "./VariableMenu";
import { useCallback, useEffect, useRef, useState } from "react";
import { ConfigurationCard } from "./ConfigurationCard";
import { useVariablesStore } from "../../store/variables-store";
import {
    MenuRoot,
    MenuItem,
    MenuContent,
    MenuTrigger
} from "../../components/ui/menu";
import { LuFolder, LuPlus, LuVariable } from "react-icons/lu";

function ConfigurationPage() {
    console.log("Render ConfigurationPage");
    const [selectedNode, setSelectedNode] = useState();
    const [selectedVariable, setSelectedVariable] = useState();
    const variables = useVariablesStore((state) => state.variables);
    const addNode = useVariablesStore((state) => state.addNode);

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
                    <MenuRoot
                        positioning={{
                            placement: "bottom-center",
                            sameWidth: true,
                        }}
                    >
                        <MenuTrigger asChild>
                            <Button size={"xs"} w={"100%"} mb={"4"}>
                                <LuPlus />
                                Создать
                            </Button>
                        </MenuTrigger>
                        <MenuContent>
                            <MenuItem value="variable" onClick={() => {
                                const node = {
                                    id: Date.now().toString(),
                                    type: "variable",
                                    subType: null,
                                    name: "test1",
                                    setting: {
                                        isSpecial: true,
                                        type: "1 бит – bool",
                                        isLua: true,
                                        description: "Lorem ipsum dolor sit amet consectetur",
                                        cmd: true,
                                        archive: true,
                                        group: "Без группы",
                                        measurement: null,
                                        coefficient: "",
                                        luaExpression: "test2 = test2 + 1",
                                        specialCycleDelay: 5
                                    }
                                };
                                addNode(null, node);
                            }}>
                                <LuVariable />
                                Переменная
                            </MenuItem>
                            <MenuItem value="folder" onClick={() => {
                                const node = {
                                    id: Date.now().toString(),
                                    type: "folder",
                                    subType: null,
                                    name: "folder1",
                                    ignoreChildren: false,
                                    setting: {
                                        /* Примерное содержимое */
                                        description: "Эта папка нужна для тестирования",
                                        group: "bemp",
                                        alias: "",
                                        tags: []
                                    },
                                    children: []
                                };
                                addNode(null, node);
                            }}>
                                <LuFolder />
                                Папка
                            </MenuItem>
                        </MenuContent>
                    </MenuRoot>
                    {
                        variables.length === 0 ? (
                            <Box p={"4"}>
                                <Text>Переменная еще не создана</Text>
                            </Box>
                        ) : (
                            <ConfigurationCard 
                                title={"Переменные"} 
                                /* data={config.children[2].children} */
                                data={variables}
                                /* setSelectedData={useCallback((node) => 
                                    setSelectedVariable(node), [])} */
                            />
                        )
                    }
                </Panel>
            </PanelGroup>
        </Box>
    );
}

export default ConfigurationPage;
