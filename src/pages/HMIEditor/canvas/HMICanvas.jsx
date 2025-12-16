import { Layer, Rect, Stage, Star } from "react-konva";
import { Grid } from "./Grid";
import { useFitToFrame } from "./hooks/useFitToFrame";
import { useActionsStore } from "../store/actions-store";
import HMITransformer from "./HMITransformer";
import { Nodes } from "./Nodes";
import { useEffect } from "react";
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
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);

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

    const handlers = {
        onPointerDown: manager.handlers.onPointerDown,
        onPointerMove: manager.handlers.onPointerMove,
        onPointerUp: manager.handlers.onPointerUp,
        onContextMenu: manager.handlers.onContextMenu,
    };

    useFitToFrame(canvasRef, width, height);
    return (
        <Stage
            ref={canvasRef}
            width={width}
            height={height}
            style={{ background: bgColor }}
            {...(viewOnlyMode ? null : handlers)}
            onWheel={manager.handlers.onWheel}
        >
            <Layer ref={nodesLayerRef} name="nodesLayer">
                <Nodes nodesRef={nodesRef} viewOnlyMode={viewOnlyMode} />
            </Layer>
            <Layer name="staticLayer">
                <Grid />
                <StartCoords />
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

const StartCoords = () => {
    const showStartCoordMarker = useActionsStore(
        (state) => state.showStartCoordMarker,
    );
    return (
        showStartCoordMarker && (
            <Star
                x={0}
                y={0}
                numPoints={4}
                innerRadius={1}
                stroke={"black"}
                strokeWidth={0.2}
            />
        )
    );
};
