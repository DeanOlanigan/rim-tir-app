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
            borderRadius={"md"}
            shadow={"md"}
            p={2}
        >
            <Text fontWeight={"medium"}>DebugInfo</Text>
            <Text>Current action: {currentAction}</Text>
            <Text>Selected nodes: {selectedIds.length}</Text>
            <Text>Nodes: {Object.keys(nodes).length}</Text>
        </Box>
    );
};
