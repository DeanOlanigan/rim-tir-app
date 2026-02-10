import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useActionsStore } from "../store/actions-store";
import { useNodeStore } from "../store/node-store";
import { LOCALE } from "../constants";

export const DebugInfo = () => {
    const debugMode = useActionsStore((state) => state.debugMode);
    const currentAction = useActionsStore((state) => state.currentAction);
    const prevAction = useActionsStore((state) => state.prevAction);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const nodes = useNodeStore((state) => state.nodes);

    if (!debugMode) return null;

    return (
        <Flex direction={"column"} h={"100%"} minH={0}>
            <Flex justify="space-between" align="center" mb={2}>
                <Heading size={"md"}>{LOCALE.debugInfo}</Heading>
            </Flex>

            <Box
                h={"100%"}
                overflow={"auto"}
                p={1}
                border={"1px solid"}
                borderColor={"border"}
                bg={"bg.muted"}
                borderRadius={"md"}
            >
                <Text>
                    {LOCALE.currentTool}: {currentAction}
                </Text>
                <Text>
                    {LOCALE.prevTool}: {prevAction}
                </Text>
                <Text>
                    {LOCALE.selectedNodes}: {selectedIds.length}
                </Text>
                <Text>
                    {LOCALE.nodes}: {Object.keys(nodes).length}
                </Text>
                {selectedIds.length > 0 && (
                    <SelectedNodeInfo nodes={nodes} selectedIds={selectedIds} />
                )}
            </Box>
        </Flex>
    );
};

const SelectedNodeInfo = ({ nodes, selectedIds }) => {
    if (selectedIds.length > 1)
        return <Text>{LOCALE.multipleNodesSelected}</Text>;

    return (
        <Box>
            {Object.entries(nodes[selectedIds[0]]).map(([key, value]) => (
                <Text key={key}>
                    {key}:{" "}
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                </Text>
            ))}
        </Box>
    );
};
