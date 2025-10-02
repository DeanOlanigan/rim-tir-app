import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "@/components/ResizebalePanel/ResizebalePanel.css";
import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { dialog } from "./setValue/dialog";
import { ConfigInfoWrapper } from "./ConfigInfo";
import { TreeCard } from "@/components/TreeView/TreeCard";
import { TREE_TYPES } from "@/config/constants";
import { TreeView } from "./Tree/TreeView";
import { SubHeader } from "@/components/Header/SubHeader";
import { SearchBar } from "./SearchBar";
import { useQuery } from "@tanstack/react-query";
import { getConfiguration, QK } from "@/api";
import { NoData } from "@/components/NoData";
import { ErrorInformer } from "@/components/ErrorInformer";
import { Loader } from "@/components/Loader";

function MonitoringPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading, isFetching, isError, error } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
    });

    if (isLoading || !data) return <Loader text={"Загрузка данных"} />;
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
