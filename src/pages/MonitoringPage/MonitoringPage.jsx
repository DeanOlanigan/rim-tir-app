import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "@/components/ResizebalePanel/ResizebalePanel.css";
import { useState } from "react";
import { AbsoluteCenter, VStack, Text, Icon, Box } from "@chakra-ui/react";
import { LuTriangleAlert, LuFileQuestion } from "react-icons/lu";
import { dialog } from "./setValue/dialog";
import { ConfigInfoWrapper } from "./ConfigInfo";
import { TreeCard } from "@/components/TreeView/TreeCard";
import { TREE_TYPES } from "@/config/constants";
import { TreeView } from "./Tree/TreeView";
import { SubHeader } from "@/components/Header/SubHeader";
import { TirLoaderIcon } from "@/components/TirLoaderIcon";
import { SearchBar } from "./SearchBar";
import { useQuery } from "@tanstack/react-query";
import { getConfiguration, QK } from "@/api";

function MonitoringPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading, isFetching, isError, error } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
    });

    if (isLoading) return <Loader text={"Загрузка данных"} />;
    if (isError) return <ErrorInformer error={error} />;

    const send = data.state[TREE_TYPES.send];
    const receive = data.state[TREE_TYPES.receive];
    const variables = data.state[TREE_TYPES.variables];

    return (
        <>
            <SubHeader>
                <ConfigInfoWrapper />
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            </SubHeader>
            <Box h={"100%"}>
                {isFetching && <Loader text={"Обновление данных"} />}

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
            </Box>
        </>
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
        <AbsoluteCenter
            w={"full"}
            h={"full"}
            bg={"blackAlpha.500"}
            zIndex={"modal"}
        >
            <VStack textAlign={"center"}>
                {/* <Spinner size={"xl"} /> */}
                <TirLoaderIcon height={"256px"} />
                <Text color={"fg.muted"} fontWeight={"medium"}>
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
