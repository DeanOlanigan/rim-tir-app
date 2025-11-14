import { Box, Flex, HStack } from "@chakra-ui/react";
import { useRef } from "react";
import { useThrottledResizeObserver } from "@/hooks/useThrottledResizeObserver";
import { ContextMenu } from "./ContextMenu";
import { ToolBar } from "./ToolBar";
import { ZoomBar } from "./ZoomBar";
import { HMICanvas } from "./canvas/HMICanvas";
import { UndoRedoButtons } from "./UndoRedoButtons";
import { NodeSettings } from "./NodeSettings";
import { EditorSettings } from "./EditorSettings";
import { DebugInfo } from "./DebugInfo";

function HMIEditor() {
    const { ref, width, height } = useThrottledResizeObserver(100);
    const canvasRef = useRef(null);

    return (
        <Flex ref={ref} h={"100%"} position={"relative"} direction={"column"}>
            <ContextMenu />
            <HMICanvas canvasRef={canvasRef} width={width} height={height} />
            <Box position={"absolute"} left={2} top={2}>
                <EditorSettings />
            </Box>
            <Box position={"absolute"} bottom={12} left={2}>
                <DebugInfo />
            </Box>
            <Box position={"absolute"} bottom={2} top={2} right={2}>
                <NodeSettings />
            </Box>
            <HStack position={"absolute"} left={2} bottom={2}>
                <ZoomBar canvasRef={canvasRef} width={width} height={height} />
                <UndoRedoButtons />
            </HStack>
            <HStack position={"absolute"} bottom={2} alignSelf={"center"}>
                <ToolBar />
            </HStack>
        </Flex>
    );
}
export default HMIEditor;
