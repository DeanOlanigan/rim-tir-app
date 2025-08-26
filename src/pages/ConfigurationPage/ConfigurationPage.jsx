import {
    Box,
    Center,
    HStack,
    Icon,
    Text,
    useMediaQuery,
    VStack,
} from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "@/components/ResizebalePanel/ResizebalePanel.css";
import { TreeCard } from "./TreeCard";
import { useVariablesStore } from "@/store/variables-store";
import { EditorCard } from "./EditorCard";
import { TREE_TYPES } from "@/config/constants";
import { EmptyConfigDialog } from "./EmptyConfigDialog";
import { ContextMenu } from "./Tree/ContextMenu/ContextMenu";
import { LuLock } from "react-icons/lu";

function ConfigurationPage() {
    const [isLargerThan1000] = useMediaQuery("(min-width: 1000px)");
    return isLargerThan1000 ? (
        <Box h={"100%"} position={"relative"}>
            <EmptyConfigDialog />
            <PanelGroup autoSaveId="persistence" direction="horizontal">
                <Panel collapsible collapsedSize={0} minSize={15}>
                    <PanelGroup autoSaveId="persistence1" direction="vertical">
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
        </Box>
    ) : (
        <MobileConfigurationPage />
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
    return <TreeCard data={data} treeType={treeType} />;
};
