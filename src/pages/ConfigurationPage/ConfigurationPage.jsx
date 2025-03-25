import { Box } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "../../components/ResizebalePanel/ResizebalePanel.css";
import { TreeCard } from "./TreeCard/TreeCard";
import { useVariablesStore } from "../../store/variables-store";
import { EditorCard } from "./EditorCard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CONSTANT_VALUES } from "../../config/constants";

function ConfigurationPage() {
    //console.log("Render ConfigurationPage");
    return (
        <DndProvider backend={HTML5Backend}>
            <Box height="100%">
                <PanelGroup autoSaveId="persistence" direction="horizontal">
                    <Panel collapsible collapsedSize={0} minSize={15}>
                        <PanelGroup
                            autoSaveId="persistence1"
                            direction="vertical"
                        >
                            <Panel collapsible collapsedSize={0} minSize={10}>
                                <ReceiveWrapper />
                            </Panel>
                            <PanelResizeHandle className="verticalLine" />
                            <Panel collapsible collapsedSize={0} minSize={10}>
                                <SendWrapper />
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
                        <VariablesWrapper />
                    </Panel>
                </PanelGroup>
            </Box>
        </DndProvider>
    );
}

export default ConfigurationPage;

// TODO Подумать над решением с обертками, может быть есть решение лучше
const VariablesWrapper = () => {
    //console.log("RENDER VariablesWrapper");
    const variables = useVariablesStore((state) => state.variables);
    return (
        <TreeCard
            data={variables}
            treeType={CONSTANT_VALUES.TREE_TYPES.variables}
        />
    );
};

const SendWrapper = () => {
    //console.log("RENDER SendWrapper");
    const send = useVariablesStore((state) => state.send);
    return <TreeCard data={send} treeType={CONSTANT_VALUES.TREE_TYPES.send} />;
};

const ReceiveWrapper = () => {
    //console.log("RENDER ReceiveWrapper");
    const receive = useVariablesStore((state) => state.receive);
    return (
        <TreeCard
            data={receive}
            treeType={CONSTANT_VALUES.TREE_TYPES.receive}
        />
    );
};
