import { Layer, Rect, Stage } from "react-konva";
import { Grid } from "./Grid";
import { useActionsStore } from "../store/actions-store";
import HMITransformer from "./HMITransformer";
import { Nodes } from "./Nodes";
import { LineTransformer } from "./LineTransformer";
import { useNodeStore } from "../store/node-store";
import { useToggleHitRegion } from "./hooks/useToggleHitRegion";
import { useStageKeyboard } from "./hooks/useStageKeyboard";
import { StartCoords } from "./StartCoords";

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
    const canvasSize = useActionsStore((state) => state.canvasSize);

    useToggleHitRegion(canvasRef, nodesLayerRef);
    useStageKeyboard(canvasRef, manager);

    console.log("CANVAS RENDER", canvasSize);

    const handlers = manager.handlers;

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
