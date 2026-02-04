import { Layer, Rect, Stage, Star } from "react-konva";
import { Grid } from "./Grid";
import { useFitToFrame } from "./hooks/useFitToFrame";
import { useActionsStore } from "../store/actions-store";
import HMITransformer from "./HMITransformer";
import { Nodes } from "./Nodes";
import { useEffect } from "react";
import { LineTransformer } from "./LineTransformer";
import { useNodeStore } from "../store/node-store";

export const HMICanvas = ({
    manager,
    canvasRef,
    overviewLayerRef,
    nodesLayerRef,
    nodesRef,
    selectionBoxRef,
    transformerRef,
}) => {
    const bgColor = useNodeStore(
        (state) => state.pages[state.activePageId].backgroundColor,
    );
    const showHitRegions = useActionsStore((state) => state.showHitRegions);
    const canvasSize = useActionsStore((state) => state.canvasSize);

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

    useEffect(() => {
        const stage = canvasRef.current;
        if (stage) {
            stage
                .container()
                .addEventListener("keydown", manager.handlers.onKeyDown, false);
            stage
                .container()
                .addEventListener("keyup", manager.handlers.onKeyUp, false);
        }

        return () => {
            if (stage) {
                stage
                    .container()
                    .removeEventListener(
                        "keydown",
                        manager.handlers.onKeyDown,
                        false,
                    );
                stage
                    .container()
                    .removeEventListener(
                        "keyup",
                        manager.handlers.onKeyUp,
                        false,
                    );
            }
        };
    }, [canvasRef, manager.handlers]);

    const handlers = manager.handlers;

    useFitToFrame({ canvasRef, nodesRef });
    return (
        <Stage
            tabIndex={0}
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{ background: bgColor, outline: "none" }}
            {...handlers}
        >
            <Layer ref={nodesLayerRef} name="nodesLayer">
                <Nodes nodesRef={nodesRef} />
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
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);
    const showStartCoordMarker = useActionsStore(
        (state) => state.showStartCoordMarker,
    );
    return (
        showStartCoordMarker &&
        !viewOnlyMode && (
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
