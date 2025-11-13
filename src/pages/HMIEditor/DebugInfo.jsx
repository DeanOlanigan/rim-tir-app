import { Box, Text } from "@chakra-ui/react";
import { useActionsStore } from "./store/actions-store";
import { useNodeStore } from "./store/node-store";

export const DebugInfo = () => {
    const debugMode = useActionsStore((state) => state.debugMode);
    const currentAction = useActionsStore((state) => state.currentAction);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const nodes = useNodeStore((state) => state.nodes);

    if (!debugMode) return null;

    return (
        <Box
            bg={"bg"}
            w={"100%"}
            h={"100%"}
            maxH={"250px"}
            overflow={"auto"}
            borderRadius={"md"}
            shadow={"md"}
            p={2}
        >
            <Text fontWeight={"medium"}>DebugInfo</Text>

            <Text>Current action: {currentAction}</Text>
            <Text>Selected nodes: {selectedIds.length}</Text>
            <Text>Nodes: {Object.keys(nodes).length}</Text>
            {selectedIds.length > 0 && (
                <SelectedNodeInfo nodes={nodes} selectedIds={selectedIds} />
            )}
        </Box>
    );
};

const SelectedNodeInfo = ({ nodes, selectedIds }) => {
    function showParam(param) {
        return selectedIds.length > 1
            ? "Multiple"
            : nodes[selectedIds[0]]?.[param];
    }

    return (
        <Box>
            <Text>Node: {showParam("type")}</Text>
            <Text>Id: {showParam("id")}</Text>
            <Text>X: {showParam("x")}</Text>
            <Text>Y: {showParam("y")}</Text>
            <Text>W: {showParam("width")}</Text>
            <Text>H: {showParam("height")}</Text>
            <Text>Rx: {showParam("radiusX")}</Text>
            <Text>Ry: {showParam("radiusY")}</Text>
        </Box>
    );
};
