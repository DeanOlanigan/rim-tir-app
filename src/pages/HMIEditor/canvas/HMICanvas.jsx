import { Layer, Rect, Stage } from "react-konva";
import { Grid } from "./Grid";
import { useFitToFrame } from "./hooks/useFitToFrame";
import { useContextMenuPos } from "./hooks/useContextMenuPos";
import { usePanZoom } from "./hooks/usePanZoom";
import { useActionsStore } from "../store/actions-store";
import HMITransformer from "./HMITransformer";
import { Nodes } from "./Nodes";
import { useRef } from "react";
import { LineTransformer } from "./LineTransformer";

export const HMICanvas = ({
    manager,
    canvasRef,
    layerRef,
    selectionBoxRef,
    transformerRef,
    width,
    height,
}) => {
    const bgColor = useActionsStore((state) => state.backgroundColor);

    const panZoom = usePanZoom();
    const onContextMenu = useContextMenuPos(canvasRef);
    useFitToFrame(canvasRef, width, height);
    const nodesRef = useRef(new Map());
    return (
        <Stage
            ref={canvasRef}
            width={width}
            height={height}
            style={{ background: bgColor }}
            onWheel={panZoom}
            onPointerDown={manager.handlers.onPointerDown}
            onPointerMove={manager.handlers.onPointerMove}
            onPointerUp={manager.handlers.onPointerUp}
            onContextMenu={onContextMenu}
        >
            <Layer name="staticLayer">
                <Grid />
            </Layer>
            <Layer name="nodesLayer">
                <Nodes nodesRef={nodesRef} />
            </Layer>
            <Layer ref={layerRef} name="overlayLayer">
                <Rect
                    ref={selectionBoxRef}
                    visible={false}
                    fill={"hsla(205, 90%, 48%, 0.1)"}
                    stroke={"hsla(205, 90%, 48%, 1)"}
                    strokeScaleEnabled={false}
                    strokeWidth={1}
                    listening={false}
                />
                <HMITransformer
                    nodesRef={nodesRef}
                    transformerRef={transformerRef}
                    canvasRef={canvasRef}
                />
                <LineTransformer
                    nodesRef={nodesRef}
                    canvasRef={canvasRef}
                    layerRef={layerRef}
                />
            </Layer>
        </Stage>
    );
};
