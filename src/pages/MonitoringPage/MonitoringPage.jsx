import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "@/components/ResizebalePanel/ResizebalePanel.css";
import { TreeCard } from "./Tree/TreeCard";
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
import { LuX, LuSearch, LuTriangleAlert, LuArrowRight } from "react-icons/lu";
import { TREE_TYPES } from "@/config/constants";
import { dialog } from "./setValue/dialog";
import { useConfigWithMqtt } from "@/utils/mqtt/listener/useConfigWithMqtt";
import { MqttTester } from "./MqttTester";
import { ConfigInfo } from "./ConfigInfo";

function MonitoringPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { isLoading, isFetching, isError, error } = useConfigWithMqtt(true); // useQuery + mqtt sub; qc.setQueryData on mqtt msg

    if (isLoading) return <Loader text={"Загрузка данных"} />;
    if (isError) return <ErrorInformer error={error} />;

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
            />
        </InputGroup>
    );
};
