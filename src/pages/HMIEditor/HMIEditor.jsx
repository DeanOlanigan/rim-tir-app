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

const minZoom = 0.3;
const maxZoom = 70;

function HMIEditor() {
    const { ref, width, height } = useThrottledResizeObserver(100);
    const canvasRef = useRef(null);

    return (
        <Flex
            ref={ref}
            bg={"bg.emphasized"}
            h={"100%"}
            w={"100%"}
            position={"relative"}
            direction={"column"}
        >
            <HMICanvas
                canvasRef={canvasRef}
                width={width}
                height={height}
                minZoom={minZoom}
                maxZoom={maxZoom}
            />

            <ContextMenu />

            <Box position={"absolute"} left={2} top={2} zIndex={"popover"}>
                <EditorSettings />
            </Box>

            <Box
                position={"absolute"}
                bottom={2}
                top={2}
                right={2}
                zIndex={"popover"}
            >
                <NodeSettings />
            </Box>

            <HStack
                position={"absolute"}
                left={2}
                bottom={2}
                zIndex={"popover"}
            >
                <ZoomBar
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                    width={width}
                    height={height}
                    canvasRef={canvasRef}
                />
                <UndoRedoButtons />
            </HStack>

            <HStack
                position={"absolute"}
                bottom={2}
                align={"center"}
                alignSelf={"center"}
                zIndex={"popover"}
            >
                <ToolBar />
            </HStack>
        </Flex>
    );
}
export default HMIEditor;
