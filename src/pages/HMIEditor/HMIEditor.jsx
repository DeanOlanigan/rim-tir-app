import { Box, HStack } from "@chakra-ui/react";
import { useRef } from "react";
import { SubHeader } from "@/components/Header/SubHeader";
import { useThrottledResizeObserver } from "@/hooks/useThrottledResizeObserver";
import { ContextMenu } from "./ContextMenu";
import { ToolBar } from "./ToolBar";
import { Header } from "./Header";
import { ZoomBar } from "./ZoomBar";
import { HMICanvas } from "./canvas/HMICanvas";
import { UndoRedoButtons } from "./UndoRedoButtons";

const minZoom = 0.3;
const maxZoom = 70;

function HMIEditor() {
    const { ref, width, height } = useThrottledResizeObserver(100);
    const canvasRef = useRef(null);

    return (
        <>
            <SubHeader>
                <Header />
            </SubHeader>
            <Box
                ref={ref}
                bg={"bg.emphasized"}
                h={"100%"}
                w={"100%"}
                position={"relative"}
            >
                <HMICanvas
                    canvasRef={canvasRef}
                    width={width}
                    height={height}
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                />
                <ContextMenu />
            </Box>
            <HStack
                position={"absolute"}
                left={5}
                bottom={10}
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
            <ToolBar />
        </>
    );
}
export default HMIEditor;
