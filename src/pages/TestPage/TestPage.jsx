import { Box } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { HMICanvas } from "./canvas/Canvas";
import { SubHeader } from "@/components/Header/SubHeader";
import { useThrottledResizeObserver } from "@/hooks/useThrottledResizeObserver";
import { ContextMenu } from "./ContextMenu";
import { ToolBar } from "./ToolBar";
import { Header } from "./Header";

const minZoom = 0.2;
const maxZoom = 70;

function TestPage() {
    const [gridSize, setGridSize] = useState(1);
    const [size, setSize] = useState({ width: 100, height: 75 });
    const [showGrid, setShowGrid] = useState(false);
    const [snap, setSnap] = useState(false);
    const [contextMenu, setContextMenu] = useState({
        x: 0,
        y: 0,
        type: null,
        visible: false,
    });

    const { ref, width, height } = useThrottledResizeObserver(100);
    const canvasRef = useRef(null);

    console.log("Render TestPage");

    return (
        <>
            <SubHeader>
                <Header
                    setSize={setSize}
                    gridSize={gridSize}
                    setGridSize={setGridSize}
                    snap={snap}
                    setSnap={setSnap}
                    showGrid={showGrid}
                    setShowGrid={setShowGrid}
                />
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
                    cHeight={size.height}
                    cWidth={size.width}
                    gridSize={gridSize}
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                    snapToGrid={snap}
                    showGrid={showGrid}
                    setContextMenu={setContextMenu}
                />
                <ContextMenu
                    contextMenu={contextMenu}
                    setContextMenu={setContextMenu}
                />
            </Box>
            <ToolBar
                width={width}
                height={height}
                minZoom={minZoom}
                maxZoom={maxZoom}
                canvasRef={canvasRef}
            />
        </>
    );
}
export default TestPage;
