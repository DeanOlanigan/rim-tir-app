import { Card, Flex, Text, Input, IconButton, Box } from "@chakra-ui/react";
import { InputGroup } from "../../components/ui/input-group";
import { LuSearch, LuX } from "react-icons/lu";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "../../components/ResizebalePanel/ResizebalePanel.css";
import { config } from "./testData";
import { AutoSizer } from "react-virtualized";
import { TreeView } from "../../components/TreeView/TreeView";
import { VariableNode } from "./VariableNode";

import { useEffect, useRef, useState } from "react";
import { produce, enableMapSet } from "immer";

enableMapSet();

import WebSocketService from "../../services/websocketService";
const wsService = new WebSocketService("ws://192.168.1.1:8800");

function matchesNode(node, part) {
    return (
        node.type === part ||
        node.setting?.name === part ||
        node.setting?.variable === part
    );
}

function updateValuesInConfig(draftConfig, updates) {
    updates.forEach(([path, newValue]) => {
        const parts = path.split("|");
        // Пример: ["receive", "testName2GPIO", "test1"]

        // Рекурсивно ищем нужный узел и обновляем его значение
        updateNode(draftConfig.children, parts, newValue);
    });
}

// Рекурсивная функция для обхода массива дочерних элементов
function updateNode(nodes, parts, newValue) {
    if (!nodes || parts.length === 0) return;

    for (const node of nodes) {
        if (matchesNode(node, parts[0])) {
            // Если это последняя часть пути — обновляем
            if (parts.length === 1) {
                if (node.setting) {
                    node.setting.value = newValue;
                }
            } else {
                // Иначе «съедаем» первую часть и идём дальше
                updateNode(node.children, parts.slice(1), newValue);
            }
        }
        // В любом случае продолжаем искать (на случай, если
        // путь может встречаться глубже в других ветвях)
        updateNode(node.children, parts, newValue);
    }
}

const findIdByName = (data, name) => {
    for (const node of data) {
        if (node?.setting.name === name || node?.setting.variable === name) return node.id;
        if (node.children) {
            const childId = findIdByName(node.children, name);
            if (childId) return childId;
        }
    }
    return null;
};

function HomePage() {
    const [data, setData] = useState(config);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("");
    
    const sendTreeRef = useRef();
    const variablesTreeRef = useRef();
    const receiveTreeRef = useRef();

    useEffect(() => {
        console.log(data);
    }, [data]);

    useEffect(() => {
        wsService.connect();
        const messageHandler = (message) => {
            /* console.log(message); */

            setData((prev) => 
                produce(prev, (draft) => {
                    /* draft.children[2].children[0].setting.value = i;  */
                    updateValuesInConfig(
                        draft,
                        message
                    );
                })
            );
        };

        wsService.addMessageHandler(messageHandler);
        
        let i = 0;
        const messageSender = setInterval(() => {
            wsService.sendMessage({ monitoring: ["OK", i] });
            i++;
        }, 1000);

        return () => {
            clearInterval(messageSender);
            wsService.removeMessageHandler(messageHandler);
            wsService.close();
        };
    }, []);

    let focusSearchTerm = "";
    let timeoutId = null;

    return (
        <>
            <PanelGroup direction="horizontal" autoSaveId={"monitoring"}>
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
                        <Card.Body px={"1"} pb={"1"}>
                            <AutoSizer>
                                {({ height, width }) => (
                                    <TreeView
                                        height={height}
                                        width={width}
                                        data={data.children[0].children}
                                        disableDrag
                                        searchTerm={searchTerm}
                                        ref={receiveTreeRef}
                                    >
                                        <VariableNode />
                                    </TreeView>
                                )}
                            </AutoSizer>
                        </Card.Body>
                    </Card.Root>
                </Panel>
                <PanelResizeHandle className="verticalLine"/>
                <Panel collapsible={true} collapsedSize={0} minSize={35}>
                    <Card.Root 
                        h={"100%"}
                        data-state={"open"}
                        animationDuration={"slow"}
                        animationStyle={{
                            _open: "scale-fade-in",
                        }}
                    >
                        <Card.Header>
                            <Card.Title>
                                <Flex gap={"2"} justify={"space-between"}>
                                    <Text>Переменные</Text>
                                    <InputGroup
                                        startElement={<LuSearch />}
                                        endElement={
                                            <IconButton
                                                size={"4xs"}
                                                rounded={"full"}
                                                variant={"ghost"}
                                                onClick={() => {
                                                    setSearchTerm("");
                                                    setFilter("");
                                                }}
                                            >
                                                <LuX />
                                            </IconButton>
                                        }
                                    >
                                        <Input
                                            placeholder="Поиск"
                                            maxW={"200px"}
                                            size={"2xs"} 
                                            variant={"flushed"}
                                            ps={"2rem"}
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.currentTarget.value);
                                                /* const sendSelected = findIdByName(data.children[0].children, e.currentTarget.value);
                                                if (sendSelected) receiveTreeRef.current.focus(sendSelected); */

                                                /* clearTimeout(timeoutId);

                                                timeoutId = setTimeout(() => {
                                                    //focusSearchTerm += e.key;
                                                    setFilter((prev) => prev += e.key);
                                                }, 600); */

                                                /* const node = receiveTreeRef.current.visibleNodes.find((n) => {
                                                    const name = n.data.setting.variable;
                                                    if (typeof name === "string") {
                                                        return name.toLowerCase().startsWith(e.currentTarget.value.toLowerCase());
                                                    } else
                                                        return false;
                                                });

                                                if (node)
                                                    receiveTreeRef.current.select(node.id); */
                                            }}
                                        />
                                    </InputGroup>
                                </Flex>
                            </Card.Title>
                        </Card.Header>
                        <Card.Body px={"1"} pb={"1"}>
                            <AutoSizer>
                                {({ height, width }) => (
                                    <TreeView
                                        height={height}
                                        width={width}
                                        data={data.children[2].children}
                                        disableDrag
                                        searchTerm={searchTerm}
                                        ref={variablesTreeRef}
                                    >
                                        <VariableNode editable={true} />
                                    </TreeView>
                                )}
                            </AutoSizer>
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
                        <Card.Body px={"1"} pb={"1"}>
                            <AutoSizer>
                                {({ height, width }) => (
                                    <TreeView
                                        height={height}
                                        width={width}
                                        data={config.children[1].children}
                                        disableDrag
                                        searchTerm={searchTerm}
                                        ref={sendTreeRef}
                                    >
                                        <VariableNode />
                                    </TreeView>
                                )}
                            </AutoSizer>
                        </Card.Body>
                    </Card.Root>
                </Panel>
            </PanelGroup>
        </>
    );
}
export default HomePage;
