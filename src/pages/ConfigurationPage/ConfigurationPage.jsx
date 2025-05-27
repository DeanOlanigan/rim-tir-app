import { Box } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "@/components/ResizebalePanel/ResizebalePanel.css";
import { TreeCard } from "./TreeCard/TreeCard";
import { useVariablesStore } from "@/store/variables-store";
import { EditorCard } from "./EditorCard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CONSTANT_VALUES } from "@/config/constants";
import { EmptyConfigDialog } from "./EmptyConfigDialog";
import { memo } from "react";
import { shallow } from "zustand/shallow";
import { ContextMenu } from "./Tree/ContextMenu/ContextMenu";
import { validateAll } from "@/utils/validator";

function ConfigurationPage() {
    validateAll();

    //console.log("Render ConfigurationPage");
    return (
        <DndProvider backend={HTML5Backend}>
            <EmptyConfigDialog />
            <Box height="100%" position="relative">
                <PanelGroup autoSaveId="persistence" direction="horizontal">
                    <Panel collapsible collapsedSize={0} minSize={15}>
                        <PanelGroup
                            autoSaveId="persistence1"
                            direction="vertical"
                        >
                            <Panel collapsible collapsedSize={0} minSize={10}>
                                <TreeWrapper
                                    selector={(state) => state.receive}
                                    treeType={
                                        CONSTANT_VALUES.TREE_TYPES.receive
                                    }
                                />
                            </Panel>
                            <PanelResizeHandle className="verticalLine" />
                            <Panel collapsible collapsedSize={0} minSize={10}>
                                <TreeWrapper
                                    selector={(state) => state.send}
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
                            selector={(state) => state.variables}
                            treeType={CONSTANT_VALUES.TREE_TYPES.variables}
                        />
                    </Panel>
                </PanelGroup>
                <ContextMenu />
            </Box>
        </DndProvider>
    );
}

export default ConfigurationPage;

const TreeWrapper = memo(function TreeWrapper({ selector, treeType }) {
    const data = useVariablesStore(selector, shallow);
    return <TreeCard data={data} treeType={treeType} />;
});
