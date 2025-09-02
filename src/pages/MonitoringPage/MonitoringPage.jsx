import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "@/components/ResizebalePanel/ResizebalePanel.css";
import { TreeCard } from "./Tree/TreeCard";
import { useEffect, useState } from "react";
import {
    Flex,
    InputGroup,
    Input,
    IconButton,
    Spinner,
    AbsoluteCenter,
    VStack,
    HStack,
    Text,
    Icon,
} from "@chakra-ui/react";
import { LuX, LuSearch, LuTriangleAlert } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { QK } from "@/api/queryKeys";
import { getConfiguration } from "@/api/configuration";
import { TREE_TYPES } from "@/config/constants";
import { useChannel } from "@/ws/useChannel";
import { useMonitoringStore } from "./store/store";
import { dialog } from "./setValue/dialog";

//import { produce, enableMapSet } from "immer";
//enableMapSet();

//import { WebSocketService } from "@/services/websocketService";
//const wsService = new WebSocketService("ws://192.168.1.1:8800");

function MonitoringPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const { isLoading, isFetching, isError, error } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
    });

    /* useEffect(() => {
        wsService.connect();
        const messageHandler = (message) => {
            if (!Array.isArray(message) || message.length === 0) return;
            useMonitoringStore.getState().setSettings(message);
        };

        wsService.addMessageHandler(messageHandler);

        const messageSender = setInterval(() => {
            wsService.sendMessage({ action: "getMonitoringData" });
        }, 1000);

        return () => {
            clearInterval(messageSender);
            wsService.removeMessageHandler(messageHandler);
            wsService.close();
        };
    }, []); */

    if (isLoading) return <Loader text={"Загрузка данных"} />;
    if (isError) return <ErrorInformer error={error} />;

    return (
        <Flex h={"100%"} direction={"column"} gap={"2"} position={"relative"}>
            {isFetching && <Loader text={"Обновление данных"} />}
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
                        type={TREE_TYPES.receive}
                        searchTerm={searchTerm}
                    />
                </Panel>
                <PanelResizeHandle className="PanelResizeHandle" />
                <Panel collapsible={true} collapsedSize={0} minSize={25}>
                    <TreeCard
                        type={TREE_TYPES.variables}
                        searchTerm={searchTerm}
                    />
                </Panel>
                <PanelResizeHandle className="PanelResizeHandle" />
                <Panel collapsible={true} collapsedSize={0} minSize={25}>
                    <TreeCard type={TREE_TYPES.send} searchTerm={searchTerm} />
                </Panel>
            </PanelGroup>
            <dialog.Viewport />
        </Flex>
    );
}
export default MonitoringPage;

const Loader = ({ text }) => {
    return (
        <AbsoluteCenter>
            <VStack w={"100%"}>
                <Spinner size={"xl"} />
                <HStack>
                    <Text color={"fg.subtle"} fontWeight={"medium"}>
                        {text}
                    </Text>
                </HStack>
            </VStack>
        </AbsoluteCenter>
    );
};

const ErrorInformer = ({ error }) => {
    return (
        <AbsoluteCenter>
            <VStack w={"100%"}>
                <Icon
                    fontSize={"164px"}
                    color={"fg.error/30"}
                    as={LuTriangleAlert}
                />
                <HStack>
                    <Text color={"fg.error"} fontWeight={"medium"}>
                        Ошибка загрузки
                    </Text>
                </HStack>
                {error?.message && (
                    <Text color={"fg.error"} fontWeight={"medium"}>
                        {error.message}
                    </Text>
                )}
            </VStack>
        </AbsoluteCenter>
    );
};
