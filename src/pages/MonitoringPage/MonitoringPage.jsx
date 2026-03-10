import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "@/components/ResizebalePanel/ResizebalePanel.css";
import { useEffect, useId, useState } from "react";
import { Box, Flex, SimpleGrid, Switch } from "@chakra-ui/react";
import { signalEditDialog, infoDialog } from "./setValue/dialog";
import { ConfigInfoWrapper } from "./ConfigInfo";
import { TreeCard } from "@/components/TreeView/TreeCard";
import { TREE_TYPES } from "@/config/constants";
import { TreeView } from "./Tree/TreeView";
import { SearchBar } from "./SearchBar";
import { useQuery } from "@tanstack/react-query";
import { getConfiguration, QK } from "@/api";
import { NoData } from "@/components/NoData";
import { ErrorInformer } from "@/components/ErrorInformer";
import { Loader } from "@/components/Loader";
import { useMqttLive } from "./useMqttLive";
import { useMonitoringLive } from "./store/mqtt-stream-store";
import { ContextMenu } from "./ContextMenu/ContextMenu";
import { Tooltip } from "@/components/ui/tooltip";

function MonitoringPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading, isFetching, isError, error } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
    });
    useEffect(() => {
        if (!data) return;
        useMonitoringLive.getState().clear();
    }, [data]);

    useMqttLive("monitoring/node/#");

    if (isLoading) return <Loader text={"Загрузка данных"} />;
    if (isError) return <ErrorInformer error={error} />;
    if (isFetching) return <Loader text={"Обновление данных"} />;

    return (
        <>
            <SimpleGrid
                columns={3}
                px={4}
                py={1}
                borderBottom={"0.25rem solid"}
                borderColor={"colorPalette.subtle"}
            >
                <Flex gap={2} align={"center"}>
                    <ConfigInfoWrapper />
                    <NameSwitcher />
                </Flex>
                <Flex justify={"center"} align={"center"}>
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </Flex>
            </SimpleGrid>
            <Box h={"100%"} minH={0}>
                <PanelGroup direction="horizontal" autoSaveId={"monitoring"}>
                    <Panel collapsible={true} collapsedSize={0} minSize={25}>
                        <TreeWrapper
                            data={data[TREE_TYPES.receive]}
                            treeType={TREE_TYPES.receive}
                            searchTerm={searchTerm}
                        />
                    </Panel>
                    <PanelResizeHandle className="PanelResizeHandle" />
                    <Panel collapsible={true} collapsedSize={0} minSize={25}>
                        <TreeWrapper
                            data={data[TREE_TYPES.variables]}
                            treeType={TREE_TYPES.variables}
                            searchTerm={searchTerm}
                        />
                    </Panel>
                    <PanelResizeHandle className="PanelResizeHandle" />
                    <Panel collapsible={true} collapsedSize={0} minSize={25}>
                        <TreeWrapper
                            data={data[TREE_TYPES.send]}
                            treeType={TREE_TYPES.send}
                            searchTerm={searchTerm}
                        />
                    </Panel>
                </PanelGroup>
                <signalEditDialog.Viewport />
                <infoDialog.Viewport />
                <ContextMenu />
            </Box>
        </>
    );
}
export default MonitoringPage;

const TreeWrapper = ({ data, treeType, searchTerm }) => {
    return (
        <TreeCard
            data={data}
            tree={({ width, height }) => (
                <TreeView
                    data={data}
                    treeType={treeType}
                    searchTerm={searchTerm}
                    width={width}
                    height={height}
                />
            )}
            empty={<NoData />}
        />
    );
};

const NameSwitcher = () => {
    const id = useId();
    const nameSwitch = useMonitoringLive((state) => state.nameSwitch);
    const switchName = useMonitoringLive.getState().switchName;

    return (
        <Tooltip
            showArrow
            content={"Переключить отображение имени/описания переменной"}
            ids={{ trigger: id }}
        >
            <Switch.Root
                ids={{ root: id }}
                size={"sm"}
                checked={nameSwitch}
                onCheckedChange={(e) => switchName(e.checked)}
            >
                <Switch.HiddenInput />
                <Switch.Control />
                <Switch.Label>Отображение имени</Switch.Label>
            </Switch.Root>
        </Tooltip>
    );
};
