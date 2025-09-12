import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "@/components/ResizebalePanel/ResizebalePanel.css";
import { useState } from "react";
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
import {
    LuX,
    LuSearch,
    LuTriangleAlert,
    LuArrowRight,
    LuFileQuestion,
} from "react-icons/lu";
import { dialog } from "./setValue/dialog";
import { useConfigWithMqtt } from "@/utils/mqtt/listener/useConfigWithMqtt";
import { MqttTester } from "./MqttTester";
import { ConfigInfo } from "./ConfigInfo";
import { TreeCard } from "@/components/TreeView/TreeCard";
import { TREE_TYPES } from "@/config/constants";
import { TreeView } from "./Tree/TreeView";

function MonitoringPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading, isFetching, isError, error } =
        useConfigWithMqtt(true);

    if (isLoading) return <Loader text={"Загрузка данных"} />;
    if (isError) return <ErrorInformer error={error} />;

    const send = data.state[TREE_TYPES.send];
    const receive = data.state[TREE_TYPES.receive];
    const variables = data.state[TREE_TYPES.variables];

    return (
        <Flex h={"100%"} direction={"column"} gap={"2"} position={"relative"}>
            {isFetching && <Loader text={"Обновление данных"} />}
            <HStack justifyContent={"center"}>
                <MqttTester />
                <ConfigInfo />
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            </HStack>
            <PanelGroup direction="horizontal" autoSaveId={"monitoring"}>
                <Panel collapsible={true} collapsedSize={0} minSize={25}>
                    <TreeWrapper
                        data={receive}
                        treeType={TREE_TYPES.receive}
                        searchTerm={searchTerm}
                    />
                </Panel>
                <PanelResizeHandle className="PanelResizeHandle" />
                <Panel collapsible={true} collapsedSize={0} minSize={25}>
                    <TreeWrapper
                        data={variables}
                        treeType={TREE_TYPES.variables}
                        searchTerm={searchTerm}
                    />
                </Panel>
                <PanelResizeHandle className="PanelResizeHandle" />
                <Panel collapsible={true} collapsedSize={0} minSize={25}>
                    <TreeWrapper
                        data={send}
                        treeType={TREE_TYPES.send}
                        searchTerm={searchTerm}
                    />
                </Panel>
            </PanelGroup>
            <dialog.Viewport />
        </Flex>
    );
}
export default MonitoringPage;

const TreeWrapper = ({ data, treeType, searchTerm }) => {
    return (
        <TreeCard
            data={data}
            tree={
                <TreeView
                    data={data}
                    treeType={treeType}
                    searchTerm={searchTerm}
                />
            }
            empty={<NoData />}
        />
    );
};

const NoData = () => {
    return (
        <AbsoluteCenter>
            <VStack textAlign={"center"}>
                <Icon
                    as={LuFileQuestion}
                    fontSize={"164px"}
                    color={"bg.muted"}
                />
                <Text color={"fg.subtle"} fontWeight={"medium"}>
                    Нет данных
                </Text>
            </VStack>
        </AbsoluteCenter>
    );
};

const Loader = ({ text }) => {
    return (
        <AbsoluteCenter>
            <VStack textAlign={"center"}>
                <Spinner size={"xl"} />
                <Text color={"fg.subtle"} fontWeight={"medium"}>
                    {text}
                </Text>
            </VStack>
        </AbsoluteCenter>
    );
};

const ErrorInformer = ({ error }) => {
    return (
        <AbsoluteCenter>
            <VStack textAlign={"center"}>
                <Icon
                    as={LuTriangleAlert}
                    fontSize={"164px"}
                    color={"fg.error/30"}
                />
                <Text color={"fg.error"} fontWeight={"medium"}>
                    Ошибка загрузки
                </Text>
                {error?.message && (
                    <Text color={"fg.error"}>{error.message}</Text>
                )}
            </VStack>
        </AbsoluteCenter>
    );
};

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    const [innerTerm, setInnerTerm] = useState(searchTerm);

    return (
        <InputGroup
            px={"2"}
            maxW={"10rem"}
            startElement={<LuSearch />}
            endElement={
                innerTerm && (
                    <>
                        <IconButton
                            size={"2xs"}
                            rounded={"full"}
                            variant={"ghost"}
                            onClick={() => {
                                setInnerTerm("");
                                setSearchTerm("");
                            }}
                        >
                            <LuX />
                        </IconButton>
                        <IconButton
                            size={"2xs"}
                            rounded={"full"}
                            variant={"surface"}
                            onClick={() => {
                                setSearchTerm(innerTerm);
                            }}
                        >
                            <LuArrowRight />
                        </IconButton>
                    </>
                )
            }
        >
            <Input
                placeholder="Поиск"
                size={"xs"}
                ps={"2rem"}
                bg={"bg"}
                borderRadius={"full"}
                shadow={"md"}
                value={innerTerm}
                onChange={(e) => {
                    setInnerTerm(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setSearchTerm(innerTerm);
                    }
                }}
            />
        </InputGroup>
    );
};
