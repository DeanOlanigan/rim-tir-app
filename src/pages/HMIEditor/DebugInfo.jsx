import { Box, Flex, Text } from "@chakra-ui/react";
import { useActionsStore } from "./store/actions-store";
import { useNodeStore } from "./store/node-store";

export const DebugInfo = () => {
    const debugMode = useActionsStore((state) => state.debugMode);
    const currentAction = useActionsStore((state) => state.currentAction);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const nodes = useNodeStore((state) => state.nodes);

    if (!debugMode) return null;

    return (
        <Flex
            direction={"column"}
            bg={"bg"}
            w={"180px"}
            h={"210px"}
            borderRadius={"md"}
            shadow={"md"}
            p={2}
        >
            <Text fontWeight={"medium"}>DebugInfo</Text>

            <Box
                h={"100%"}
                overflow={"auto"}
                p={1}
                border={"1px solid"}
                borderColor={"border"}
                bg={"bg.muted"}
                borderRadius={"md"}
            >
                <Text>Current action: {currentAction}</Text>
                <Text>Selected nodes: {selectedIds.length}</Text>
                <Text>Nodes: {Object.keys(nodes).length}</Text>
                {selectedIds.length > 0 && (
                    <SelectedNodeInfo nodes={nodes} selectedIds={selectedIds} />
                )}
            </Box>
        </Flex>
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
            <Text>
                Points:{" "}
                {Array.isArray(showParam("points")) &&
                    showParam("points")?.join(", ")}
            </Text>
        </Box>
    );
};
