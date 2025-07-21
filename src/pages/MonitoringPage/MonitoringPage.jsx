import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "@/components/ResizebalePanel/ResizebalePanel.css";
import { useMonitoringStore } from "@/store/monitoring-store";
import { TreeCard } from "./TreeCard";
import { useEffect, useState } from "react";
import { Flex, InputGroup, Input, IconButton, Spinner } from "@chakra-ui/react";
import { LuX, LuSearch, LuGripVertical } from "react-icons/lu";
import axios from "axios";
import { parseXmlToState } from "@/utils/xmlToStore";

//import { produce, enableMapSet } from "immer";
//enableMapSet();

//import WebSocketService from "@/services/websocketService";
//const wsService = new WebSocketService("ws://192.168.1.1:8800");

/* function matchesNode(node, part) {
    return (
        node.type === part ||
        node.setting?.name === part ||
        node.setting?.variable === part
    );
} */

/* function updateValuesInConfig(draftConfig, updates) {
    updates.forEach(([path, newValue]) => {
        const parts = path.split("|");
        // Пример: ["receive", "testName2GPIO", "test1"]

        // Рекурсивно ищем нужный узел и обновляем его значение
        updateNode(draftConfig.children, parts, newValue);
    });
} */

// Рекурсивная функция для обхода массива дочерних элементов
/* function updateNode(nodes, parts, newValue) {
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
} */

/* const findIdByName = (data, name) => {
    for (const node of data) {
        if (node?.setting.name === name || node?.setting.variable === name)
            return node.id;
        if (node.children) {
            const childId = findIdByName(node.children, name);
            if (childId) return childId;
        }
    }
    return null;
}; */

function MonitoringPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // TODO Переделать с использованием tanstack query, запилить инвалидацию
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        axios
            .get("/api/v2/getConfiguration")
            .then((res) => {
                const { state } = parseXmlToState(res.data.data);
                setData(state);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // TODO Переделать
    /* useEffect(() => {
        wsService.connect();
        const messageHandler = (message) => {
            //console.log(message);

            setData((prev) =>
                produce(prev, (draft) => {
                    //draft.children[2].children[0].setting.value = i; 
                    updateValuesInConfig(draft, message);
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
    }, []); */

    //const { setValuesMap } = useMonitoringStore();

    /* useEffect(() => {
        const test = setInterval(() => {
            setValuesMap({
                "5e313f51-786c-4830-862b-3f14f8aa2733": Math.random(),
                "fffff35e-be0e-4047-8fcb-3913ae1681bd": Math.random(),
                "e08ae12c-b6ad-4b65-b138-03d0bda72c3a": Math.random(),
                "92524877-a0eb-4d3a-9106-76c4284cbea6": Math.random(),
            });
        }, 2000);
        return () => clearInterval(test);
    }, [setValuesMap]); */

    return (
        <Flex h={"100%"} direction={"column"} gap={"2"}>
            <Flex direction={"row"} justifyContent={"center"}>
                <InputGroup
                    maxW={"300px"}
                    startElement={<LuSearch />}
                    endElement={
                        <IconButton
                            size={"4xs"}
                            rounded={"full"}
                            variant={"ghost"}
                            onClick={() => {
                                setSearchTerm("");
                            }}
                        >
                            <LuX />
                        </IconButton>
                    }
                >
                    <Input
                        placeholder="Поиск"
                        size={"xs"}
                        ps={"2rem"}
                        bg={"bg"}
                        borderRadius={"full"}
                        shadow={"md"}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.currentTarget.value);
                        }}
                    />
                </InputGroup>
            </Flex>
            <PanelGroup direction="horizontal" autoSaveId={"monitoring"}>
                <Panel collapsible={true} collapsedSize={0} minSize={25}>
                    <TreeCard
                        data={data?.receive}
                        searchTerm={searchTerm}
                        isLoading={isLoading}
                        error={error}
                    />
                </Panel>
                <PanelResizeHandle className="PanelResizeHandle" />
                <Panel collapsible={true} collapsedSize={0} minSize={25}>
                    <TreeCard
                        data={data?.variables}
                        searchTerm={searchTerm}
                        isLoading={isLoading}
                        error={error}
                    />
                </Panel>
                <PanelResizeHandle className="PanelResizeHandle" />
                <Panel collapsible={true} collapsedSize={0} minSize={25}>
                    <TreeCard
                        data={data?.send}
                        searchTerm={searchTerm}
                        isLoading={isLoading}
                        error={error}
                    />
                </Panel>
            </PanelGroup>
        </Flex>
    );
}
export default MonitoringPage;
