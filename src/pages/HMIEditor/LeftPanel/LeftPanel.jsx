import { Box, Flex, HStack, Spacer } from "@chakra-ui/react";
import { useActionsStore } from "../store/actions-store";
import { MinimizedPanel } from "./MinimizedPanel";
import { ExpandedPanel } from "./ExpandedPanel";
import { ZoomBar } from "./ZoomBar";
import { UndoRedoButtons } from "./UndoRedoButtons";

export const LeftPanel = ({ tools, width, height }) => {
    const isUiExpanded = useActionsStore((state) => state.isUiExpanded);
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);

    const isMinimized = !isUiExpanded || viewOnlyMode;

    return (
        <Flex h={"100%"} minH={0} gap={1} direction={"column"}>
            {isMinimized ? (
                <Box pointerEvents={"auto"}>
                    <MinimizedPanel
                        tools={tools}
                        width={width}
                        height={height}
                    />
                </Box>
            ) : (
                <Flex h={"100%"} minH={0} pointerEvents={"auto"}>
                    <ExpandedPanel
                        tools={tools}
                        width={width}
                        height={height}
                    />
                </Flex>
            )}
            <Spacer />
            <HStack>
                <Box pointerEvents={"auto"}>
                    <ZoomBar
                        canvasRef={tools.canvasRef}
                        nodesRef={tools.nodesRef}
                        width={width}
                        height={height}
                    />
                </Box>
                <Box pointerEvents={"auto"}>
                    <UndoRedoButtons />
                </Box>
            </HStack>
        </Flex>
    );
};
