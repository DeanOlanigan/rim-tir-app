import { useRef } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { Grid } from "./Grid";
import { useFitToFrame } from "./hooks/useFitToFrame";
import { useContextMenuPos } from "./hooks/useContextMenuPos";
import { usePanZoom } from "./hooks/usePanZoom";
import { NodesLayer } from "./layers/NodesLayer";
import { useActionsStore } from "../store/actions-store";
import { useToolsManager } from "./hooks/useToolsManager";
import HMITransformer from "./HMITransformer";

export const HMICanvas = ({ canvasRef, width, height }) => {
    const size = useActionsStore((state) => state.size);
    const bgColor = useActionsStore((state) => state.backgroundColor);
    const workAreaColor = useActionsStore((state) => state.workAreaColor);

    const selectionBoxRef = useRef(null);
    const tr = useRef(null);

    const manager = useToolsManager(canvasRef, selectionBoxRef, tr);

    const panZoom = usePanZoom();
    const onContextMenu = useContextMenuPos(canvasRef);
    useFitToFrame(canvasRef, width, height);

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
            <Layer id="DraftLayer">
                <Rect
                    width={size.width}
                    height={size.height}
                    fill={workAreaColor}
                    listening={false}
                />
                <Grid />
                <NodesLayer />
                <Rect
                    ref={selectionBoxRef}
                    visible={false}
                    fill={"hsla(205, 90%, 48%, 0.1)"}
                    stroke={"hsla(205, 90%, 48%, 1)"}
                    strokeScaleEnabled={false}
                    strokeWidth={1}
                    listening={false}
                />
                <HMITransformer transformerRef={tr} canvasRef={canvasRef} />
            </Layer>
        </Stage>
    );
};
