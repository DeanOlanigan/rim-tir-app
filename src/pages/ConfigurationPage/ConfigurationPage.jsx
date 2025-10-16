import {
    AbsoluteCenter,
    Box,
    Center,
    HStack,
    Icon,
    Kbd,
    Text,
    VStack,
} from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "@/components/ResizebalePanel/ResizebalePanel.css";
import { useVariablesStore } from "@/store/variables-store";
import { EditorCard } from "./Editor/EditorCard";
import { TREE_TYPES } from "@/config/constants";
import { EmptyConfigDialog } from "./Dialogs/EmptyConfigDialog";
import { ContextMenu } from "./Tree/ContextMenu/ContextMenu";
import { LuBadgePlus, LuLock } from "react-icons/lu";
import { TreeCard } from "@/components/TreeView/TreeCard";
import { TreeView } from "./Tree/TreeView";
import { BaseConfCard } from "./BaseConfCard/BaseConfCard";
import { ConfSyncManager } from "./ConfSyncManager";

function ConfigurationPage() {
    return (
        <>
            <BaseConfCard />
            <Box h={"100%"} position={"relative"}>
                <EmptyConfigDialog />
                <PanelGroup
                    autoSaveId="configuration-main-panel"
                    direction="horizontal"
                >
                    <Panel collapsible collapsedSize={0} minSize={15}>
                        <PanelGroup
                            autoSaveId="configuration-connections-panel"
                            direction="vertical"
                        >
                            <Panel collapsible collapsedSize={0} minSize={10}>
                                <TreeWrapper treeType={TREE_TYPES.receive} />
                            </Panel>
                            <PanelResizeHandle className="PanelResizeHandle" />
                            <Panel collapsible collapsedSize={0} minSize={10}>
                                <TreeWrapper treeType={TREE_TYPES.send} />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                    <PanelResizeHandle className="PanelResizeHandle" />
                    <Panel minSize={45}>
                        <EditorCard />
                    </Panel>
                    <PanelResizeHandle className="PanelResizeHandle" />
                    <Panel
                        collapsible
                        collapsedSize={0}
                        defaultSize={30}
                        minSize={15}
                    >
                        <TreeWrapper treeType={TREE_TYPES.variables} />
                    </Panel>
                </PanelGroup>
                <ContextMenu />
                <ConfSyncManager />
            </Box>
        </>
    );
}
export default ConfigurationPage;

const MobileConfigurationPage = () => {
    return (
        <Center h={"100%"}>
            <VStack w={"100%"}>
                <Icon fontSize={"164px"} color={"bg.muted"} as={LuLock} />
                <HStack>
                    <Text color={"fg.subtle"} fontWeight={"medium"}>
                        Данная страница не поддерживает мобильные устройства
                    </Text>
                </HStack>
            </VStack>
        </Center>
    );
};

const TreeWrapper = ({ treeType }) => {
    const data = useVariablesStore((state) => state[treeType]);
    return (
        <TreeCard
            data={data}
            tree={<TreeView data={data} treeType={treeType} />}
            empty={<ContextMenuHint />}
        />
    );
};

const ContextMenuHint = () => {
    return (
        <AbsoluteCenter>
            <VStack textAlign={"center"}>
                <Icon as={LuBadgePlus} fontSize={"164px"} color={"bg.muted"} />
                <Text color={"fg.subtle"} fontWeight={"medium"}>
                    Открыть контекстное меню
                </Text>
                <Kbd>ПКМ</Kbd>
            </VStack>
        </AbsoluteCenter>
    );
};
