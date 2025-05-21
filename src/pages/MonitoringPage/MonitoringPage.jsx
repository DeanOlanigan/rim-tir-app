import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "@/components/ResizebalePanel/ResizebalePanel.css";
import { useVariablesStore } from "@/store/variables-store";
import { useMonitoringStore } from "@/store/monitoring-store";
import { TreeCard } from "./TreeCard";
import { useEffect, useState } from "react";
import { Flex, InputGroup, Input, IconButton } from "@chakra-ui/react";
import { LuX, LuSearch } from "react-icons/lu";

//import { produce, enableMapSet } from "immer";
//enableMapSet();

//import WebSocketService from "../../services/websocketService";
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

    const { variables, send, receive } = useVariablesStore((state) => state);
    const setValuesMap = useMonitoringStore((state) => state.setValuesMap);

    useEffect(() => {
        const test = setInterval(() => {
            setValuesMap({
                "5e313f51-786c-4830-862b-3f14f8aa2733": Math.random(),
                "fffff35e-be0e-4047-8fcb-3913ae1681bd": Math.random(),
                "e08ae12c-b6ad-4b65-b138-03d0bda72c3a": Math.random(),
                "92524877-a0eb-4d3a-9106-76c4284cbea6": Math.random(),
            });
        }, 2000);
        return () => clearInterval(test);
    }, [setValuesMap]);

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
                        data={receive}
                        title={"Прием"}
                        searchTerm={searchTerm}
                    />
                </Panel>
                <PanelResizeHandle className="verticalLine" />
                <Panel collapsible={true} collapsedSize={0} minSize={25}>
                    <TreeCard
                        data={variables}
                        title={"Переменные"}
                        searchTerm={searchTerm}
                    />
                </Panel>
                <PanelResizeHandle className="verticalLine" />
                <Panel collapsible={true} collapsedSize={0} minSize={25}>
                    <TreeCard
                        data={send}
                        title={"Передача"}
                        searchTerm={searchTerm}
                    />
                </Panel>
            </PanelGroup>
        </Flex>
    );
}
export default MonitoringPage;
