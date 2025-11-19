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
import { useToolsManager } from "./canvas/hooks/useToolsManager";

function HMIEditor() {
    const { ref, width, height } = useThrottledResizeObserver(100);
    const tools = useToolsManager();

    return (
        <Flex ref={ref} h={"100%"} position={"relative"} direction={"column"}>
            <ContextMenu />
            <HMICanvas {...tools} width={width} height={height} />
            <Box position={"absolute"} left={2} top={2}>
                <EditorSettings />
            </Box>
            <Box position={"absolute"} bottom={12} left={2}>
                <DebugInfo />
            </Box>
            <Box position={"absolute"} bottom={2} top={2} right={2}>
                <NodeSettings canvasRef={tools.canvasRef} />
            </Box>
            <HStack position={"absolute"} left={2} bottom={2}>
                <ZoomBar
                    canvasRef={tools.canvasRef}
                    width={width}
                    height={height}
                />
                <UndoRedoButtons />
            </HStack>
            <HStack position={"absolute"} bottom={2} alignSelf={"center"}>
                <ToolBar manager={tools.manager} />
            </HStack>
        </Flex>
    );
}
export default HMIEditor;
