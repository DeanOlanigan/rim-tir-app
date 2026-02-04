import { Box, HStack } from "@chakra-ui/react";
import { ZoomBar } from "./ZoomBar";
import { UndoRedoButtons } from "./UndoRedoButtons";

export const ZoomUndoBlock = ({ tools }) => {
    return (
        <HStack>
            <Box pointerEvents={"auto"}>
                <ZoomBar
                    canvasRef={tools.canvasRef}
                    nodesRef={tools.nodesRef}
                />
            </Box>
            <Box pointerEvents={"auto"}>
                <UndoRedoButtons />
            </Box>
        </HStack>
    );
};
