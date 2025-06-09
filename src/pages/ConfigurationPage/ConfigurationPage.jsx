import { Box } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "@/components/ResizebalePanel/ResizebalePanel.css";
import { TreeCard } from "./TreeCard";
import { useVariablesStore } from "@/store/variables-store";
import { EditorCard } from "./EditorCard";
import { CONSTANT_VALUES } from "@/config/constants";
import { EmptyConfigDialog } from "./EmptyConfigDialog";
import { shallow } from "zustand/shallow";
import { ContextMenu } from "./Tree/ContextMenu/ContextMenu";
import { validateAll } from "@/utils/validator";

function ConfigurationPage() {
    //console.log("Render ConfigurationPage");
    validateAll();
    const receiveSelector = (state) => state.receive;
    const sendSelector = (state) => state.send;
    const variablesSelector = (state) => state.variables;

    return (
        <Box height="100%" position="relative">
            <EmptyConfigDialog />
            <PanelGroup autoSaveId="persistence" direction="horizontal">
                <Panel collapsible collapsedSize={0} minSize={15}>
                    <PanelGroup
                        autoSaveId="persistence1"
                        direction="vertical"
                    >
                        <Panel collapsible collapsedSize={0} minSize={10}>
                            <TreeWrapper
                                selector={receiveSelector}
                                treeType={
                                    CONSTANT_VALUES.TREE_TYPES.receive
                                }
                            />
                        </Panel>
                        <PanelResizeHandle className="verticalLine" />
                        <Panel collapsible collapsedSize={0} minSize={10}>
                            <TreeWrapper
                                selector={sendSelector}
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
                        selector={variablesSelector}
                        treeType={CONSTANT_VALUES.TREE_TYPES.variables}
                    />
                </Panel>
            </PanelGroup>
            <ContextMenu />
        </Box>
    );
}

export default ConfigurationPage;

const TreeWrapper = ({ selector, treeType }) => {
    const data = useVariablesStore(selector, shallow);
    return <TreeCard data={data} treeType={treeType} />;
};
