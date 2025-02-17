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
import { AutoSizer } from "react-virtualized";
import { TreeView } from "./Tree/TreeView";

function ConfigurationPage() {
    console.log("Render ConfigurationPage");
    const [selectedNode, setSelectedNode] = useState();
    const [selectedVariable, setSelectedVariable] = useState();

    const variables = useVariablesStore((state) => state.variables);
    const selectedNodeId = useVariablesStore((state) => state.selectedNode);
    const setSelectedNodeId = useVariablesStore((state) => state.setSelectedNode);
    const addNode = useVariablesStore((state) => state.addNode);
    const updateNode = useVariablesStore((state) => state.updateNode);

    const variableTreeRef = useRef(null);

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

    const handleRename = ({ id, name }) => {
        console.log("rename", id, name);
        updateNode(id, { name });
    };

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
                                                data={config.children[0].children}
                                                onSelect={(node) => setSelectedNode(node)}
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
                                                data={config.children[1].children}
                                                onSelect={(node) => setSelectedNode(node)}
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
                            <Card.Title>Конфигурация</Card.Title>
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
                                    ref={panelRef}
                                    collapsible
                                    collapsedSize={0}
                                    minSize={30}
                                >
                                    <Box w={"100%"} h={"100%"} pt={"2"}>
                                        <VariableMenu
                                            selectedData={selectedNodeId}
                                        />
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
                            <Card.Title>Переменные</Card.Title>
                        </Card.Header>
                        <Card.Body>
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
                                    <MenuItem
                                        value="variable"
                                        onClick={() => {
                                            const id = String(
                                                variables.length + 1
                                            );
                                            const node = {
                                                id: id,
                                                type: "variable",
                                                subType: null,
                                                name: "",
                                                setting: {
                                                    isSpecial: false,
                                                    type: "1 бит – bool",
                                                    isLua: false,
                                                    description: "",
                                                    cmd: false,
                                                    archive: false,
                                                    group: "Без группы",
                                                    measurement: null,
                                                    coefficient: null,
                                                    luaExpression: "",
                                                    specialCycleDelay: null,
                                                },
                                            };
                                            addNode(null, node);
                                        }}
                                    >
                                        <LuVariable />
                                        Переменная
                                    </MenuItem>
                                    <MenuItem
                                        value="folder"
                                        onClick={() => {
                                            console.log(
                                                "variables: ",
                                                variables
                                            );
                                            console.log(
                                                "selectedNodeId: ",
                                                selectedNodeId
                                            );
                                            const id = String(
                                                variables.length + 1
                                            );
                                            const node = {
                                                id: id,
                                                type: "folder",
                                                subType: null,
                                                name: "",
                                                ignoreChildren: false,
                                                setting: {
                                                    /* Примерное содержимое */
                                                    description: "",
                                                    group: "",
                                                    alias: "",
                                                    tags: [],
                                                },
                                                children: [],
                                            };
                                            //addNode(null, node);
                                            // Мультиселект работает для узлов, которые находятся не рядом
                                            //variableTreeRef.current.selectMulti("3.2.5");
                                            //variableTreeRef.current.selectMulti("3.2.2");
                                        }}
                                    >
                                        <LuFolder />
                                        Папка
                                    </MenuItem>
                                </MenuContent>
                            </MenuRoot>
                            {variables.length === 0 ? (
                                <Box p={"4"}>
                                    <Text>Переменная еще не создана</Text>
                                </Box>
                            ) : (
                                <AutoSizer>
                                    {({ height, width }) => (
                                        <TreeView
                                            height={height}
                                            width={width}
                                            data={variables}
                                            onSelect={(node) => {
                                                const data = node.map((node) => {
                                                    return node.data;
                                                });
                                                setSelectedNodeId(data);
                                            }}
                                            ref={variableTreeRef}
                                            onRename={handleRename}
                                        />
                                    )}
                                </AutoSizer>
                            )}
                        </Card.Body>
                    </Card.Root>
                </Panel>
            </PanelGroup>
        </Box>
    );
}

export default ConfigurationPage;
