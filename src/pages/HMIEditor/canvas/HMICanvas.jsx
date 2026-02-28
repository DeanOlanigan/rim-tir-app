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
import { Ruler } from "./Ruler";
import { useEffectiveNode } from "../store/interactive-store";
import { getNodeParentLocalAABB } from "../store/utils/geometry";

export const HMICanvas = ({
    manager,
    canvasRef,
    overviewLayerRef,
    nodesLayerRef,
    nodesRef,
    selectionBoxRef,
    transformerRef,
    api,
}) => {
    const bgColor = useNodeStore(
        (state) => state.pages[state.activePageId].backgroundColor,
    );
    const canvasSize = useActionsStore((state) => state.canvasSize);

    useToggleHitRegion(canvasRef, nodesLayerRef);
    useStageKeyboard(canvasRef, manager, { api });

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
                <SelectionRects />
                <Ruler />
            </Layer>
        </Stage>
    );
};

const SelectionRects = () => {
    const selectedIds = useNodeStore((state) => state.selectedIds);
    if (selectedIds.length < 2) return null;
    return selectedIds.map((id) => <SelectionRect key={id} id={id} />);
};

const SelectionRect = ({ id }) => {
    const node = useEffectiveNode(id);
    const aabb = getNodeParentLocalAABB(node);
    return (
        <Rect
            x={aabb.x}
            y={aabb.y}
            width={aabb.width}
            height={aabb.height}
            stroke="rgb(0, 100, 255)"
            strokeWidth={2}
            strokeScaleEnabled={false}
            listening={false}
        />
    );
};
