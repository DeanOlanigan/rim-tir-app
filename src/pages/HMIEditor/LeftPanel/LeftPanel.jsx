import { Box, Flex, Spacer } from "@chakra-ui/react";
import { useActionsStore } from "../store/actions-store";
import { MinimizedPanel } from "./MinimizedPanel";
import { ExpandedPanel } from "./ExpandedPanel";
import { ZoomUndoBlock } from "./ZoomUndoBlock";

export const LeftPanel = ({ tools }) => {
    const isUiExpanded = useActionsStore((state) => state.isUiExpanded);
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);

    const isMinimized = !isUiExpanded || viewOnlyMode;

    return (
        <Flex h={"100%"} minH={0} gap={1} direction={"column"}>
            {isMinimized ? (
                <>
                    <Box pointerEvents={"auto"}>
                        <MinimizedPanel tools={tools} />
                    </Box>
                    <Spacer />
                    <ZoomUndoBlock tools={tools} />
                </>
            ) : (
                <Flex h={"100%"} minH={0} pointerEvents={"auto"}>
                    <ExpandedPanel tools={tools} />
                </Flex>
            )}
        </Flex>
    );
};
