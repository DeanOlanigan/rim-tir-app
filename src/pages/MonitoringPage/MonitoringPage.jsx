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
    Switch,
    Badge,
} from "@chakra-ui/react";
import { LuX, LuSearch, LuTriangleAlert } from "react-icons/lu";
import { TREE_TYPES } from "@/config/constants";
import { dialog } from "./setValue/dialog";
import { useMqttMock } from "@/utils/mqtt/publisher/useMqttMock";
import { useConfigWithMqtt } from "@/utils/mqtt/listener/useConfigWithMqtt";

function MonitoringPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { isLoading, isFetching, isError, error } = useConfigWithMqtt(true);

    if (isLoading) return <Loader text={"Загрузка данных"} />;
    if (isError) return <ErrorInformer error={error} />;

    return (
        <Flex h={"100%"} direction={"column"} gap={"2"} position={"relative"}>
            {isFetching && <Loader text={"Обновление данных"} />}
            <Flex direction={"row"} justifyContent={"center"} gap={"2"}>
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <MqttTester />
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

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
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
    );
};

const MqttTester = () => {
    const [on, setOn] = useState(false);

    useMqttMock({
        enabled: on,
        periodMs: 500,
        topicBase: "test",
    });

    return (
        <HStack>
            <Switch.Root checked={on} onCheckedChange={(e) => setOn(e.checked)}>
                <Switch.HiddenInput />
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>MQTT Tester</Switch.Label>
            </Switch.Root>
            <Badge colorPalette={on ? "green" : "gray"}>
                {on ? "ON" : "OFF"}
            </Badge>
        </HStack>
    );
};
