import { Box } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "../../components/ResizebalePanel/ResizebalePanel.css";
import { VariableCard } from "./TreeCard/VariableCard";
import { useVariablesStore } from "../../store/variables-store";
import { EditorCard } from "./EditorCard";

function ConfigurationPage() {
    console.log("Render ConfigurationPage");
    //const [selectedNode, setSelectedNode] = useState();

    return (
        <Box height="100%">
            <PanelGroup autoSaveId="persistence" direction="horizontal">
                <Panel collapsible={true} collapsedSize={0} minSize={15}>
                    <PanelGroup autoSaveId="persistence1" direction="vertical">
                        <Panel minSize={15}>
                            <ReceiveWrapper />
                        </Panel>
                        <PanelResizeHandle className="verticalLine" />
                        <Panel minSize={15}>
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
                    collapsible={true}
                    collapsedSize={0}
                    defaultSize={30}
                    minSize={15}
                >
                    <VariablesWrapper />
                </Panel>
            </PanelGroup>
        </Box>
    );
}

export default ConfigurationPage;

// TODO Подумать над решением с обертками, может быть есть решение лучше
const VariablesWrapper = () => {
    console.log("RENDER VariablesWrapper");
    const variables = useVariablesStore((state) => state.variables);
    return <VariableCard data={variables} type={"variables"} />;
};

const SendWrapper = () => {
    console.log("RENDER SendWrapper");
    const send = useVariablesStore((state) => state.send);
    return <VariableCard data={send} type={"send"} />;
};

const ReceiveWrapper = () => {
    console.log("RENDER ReceiveWrapper");
    const receive = useVariablesStore((state) => state.receive);
    return <VariableCard data={receive} type={"receive"} />;
};
