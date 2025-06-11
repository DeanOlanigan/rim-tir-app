import { Box } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "@/components/ResizebalePanel/ResizebalePanel.css";
import { TreeCard } from "./TreeCard";
import { useVariablesStore } from "@/store/variables-store";
import { EditorCard } from "./EditorCard";
import { CONSTANT_VALUES } from "@/config/constants";
import { EmptyConfigDialog } from "./EmptyConfigDialog";
import { ContextMenu } from "./Tree/ContextMenu/ContextMenu";
import { validateAll } from "@/utils/validator";

function ConfigurationPage() {
    //console.log("Render ConfigurationPage");
    const state = useVariablesStore.getState().settings;
    validateAll(state);

    return (
        <Box height="100%" position="relative">
            <EmptyConfigDialog />
            <PanelGroup autoSaveId="persistence" direction="horizontal">
                <Panel collapsible collapsedSize={0} minSize={15}>
                    <PanelGroup autoSaveId="persistence1" direction="vertical">
                        <Panel collapsible collapsedSize={0} minSize={10}>
                            <TreeWrapper
                                treeType={CONSTANT_VALUES.TREE_TYPES.receive}
                            />
                        </Panel>
                        <PanelResizeHandle className="verticalLine" />
                        <Panel collapsible collapsedSize={0} minSize={10}>
                            <TreeWrapper
                                treeType={CONSTANT_VALUES.TREE_TYPES.send}
                            />
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle className="verticalLine" />
                <Panel minSize={45}>
                    <EditorCard />
                </Panel>
                <PanelResizeHandle className="verticalLine" />
                <Panel
                    collapsible
                    collapsedSize={0}
                    defaultSize={30}
                    minSize={15}
                >
                    <TreeWrapper
                        treeType={CONSTANT_VALUES.TREE_TYPES.variables}
                    />
                </Panel>
            </PanelGroup>
            <ContextMenu />
        </Box>
    );
}

export default ConfigurationPage;

const TreeWrapper = ({ treeType }) => {
    const data = useVariablesStore((state) => state[treeType]);
    return <TreeCard data={data} treeType={treeType} />;
};
