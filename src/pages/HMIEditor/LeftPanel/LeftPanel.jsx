import { Box, Flex, Spacer } from "@chakra-ui/react";
import { useActionsStore } from "../store/actions-store";
import { MinimizedPanel } from "./MinimizedPanel";
import { ExpandedPanel } from "./ExpandedPanel";
import { ZoomUndoBlock } from "./ZoomUndoBlock";

export const LeftPanel = ({ tools }) => {
    const isUiExpanded = useActionsStore((state) => state.isUiExpanded);
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);
    const showRulers = useActionsStore((state) => state.showRulers);

    const isMinimized = !isUiExpanded || viewOnlyMode;

    return (
        <Flex
            h={"100%"}
            minH={0}
            gap={1}
            direction={"column"}
            pt={showRulers ? 8 : 2}
            pl={showRulers ? 8 : 2}
            pb={2}
            transition={"padding 0.2s ease-in-out"}
        >
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
