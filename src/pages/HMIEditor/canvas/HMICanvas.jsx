import { Layer, Rect, Stage } from "react-konva";
import { Grid } from "./Grid";
import { useFitToFrame } from "./hooks/useFitToFrame";
import { useContextMenuPos } from "./hooks/useContextMenuPos";
import { usePanZoom } from "./hooks/usePanZoom";
import { useActionsStore } from "../store/actions-store";
import HMITransformer from "./HMITransformer";
import { Nodes } from "./Nodes";
import { useEffect, useRef } from "react";
import { LineTransformer } from "./LineTransformer";

export const HMICanvas = ({
    manager,
    canvasRef,
    overviewLayerRef,
    nodesLayerRef,
    nodesRef,
    selectionBoxRef,
    transformerRef,
    width,
    height,
}) => {
    const bgColor = useActionsStore((state) => state.backgroundColor);
    const showHitRegions = useActionsStore((state) => state.showHitRegions);

    useEffect(() => {
        if (showHitRegions) {
            canvasRef.current
                .container()
                .appendChild(nodesLayerRef.current.hitCanvas._canvas);

            nodesLayerRef.current.hitCanvas._canvas.style.position = "absolute";
            nodesLayerRef.current.hitCanvas._canvas.style.top = 0;
            nodesLayerRef.current.hitCanvas._canvas.style.left = 0;
        } else {
            nodesLayerRef.current.hitCanvas._canvas.remove();
        }
    }, [showHitRegions, nodesLayerRef, canvasRef]);

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
            <Layer name="staticLayer">
                <Grid />
            </Layer>
            <Layer ref={nodesLayerRef} name="nodesLayer">
                <Nodes nodesRef={nodesRef} />
            </Layer>
            <Layer ref={overviewLayerRef} name="overlayLayer">
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
                    overviewRef={overviewLayerRef}
                />
            </Layer>
        </Stage>
    );
};
