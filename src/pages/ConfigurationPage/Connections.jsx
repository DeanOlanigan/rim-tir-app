import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { SendCard } from "./SendCard";
import { ReceiveCard } from "./ReceiveCard";
import { useState, memo } from "react";

export const Connections = memo(function Connections() {
    console.log("Render Connections");

    const [selectedNode, setSelectedNode] = useState([]);

    return (
        <PanelGroup autoSaveId="persistence1" direction="vertical">
            <Panel minSize={15}>
                <SendCard selectedNode={selectedNode} setSelectedNode={setSelectedNode}/>
            </Panel>
            <PanelResizeHandle className="verticalLine"/>
            <Panel minSize={15}>
                <ReceiveCard selectedNode={selectedNode} setSelectedNode={setSelectedNode}/>
            </Panel>
        </PanelGroup>
    );
});
