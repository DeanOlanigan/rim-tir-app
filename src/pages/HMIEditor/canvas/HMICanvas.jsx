import { useEffect, useRef } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { Grid } from "./Grid";
import { useFitToFrame } from "./hooks/useFitToFrame";
import { useContextMenuPos } from "./hooks/useContextMenuPos";
import { usePanZoom } from "./hooks/usePanZoom";
import { NodesLayer } from "./layers/NodesLayer";
import { useActionsStore } from "../store/actions-store";
import { useNodeStore } from "../store/node-store";
import { HMITransformer } from "./HMITransformer";
import { ACTIONS } from "../store/actions";
import { useToolsManager } from "./hooks/useToolsManager";

export const HMICanvas = ({ canvasRef, width, height }) => {
    const currentAction = useActionsStore((state) => state.currentAction);
    const size = useActionsStore((state) => state.size);
    const gridSize = useActionsStore((state) => state.gridSize);
    const snapToGrid = useActionsStore((state) => state.snap);
    const bgColor = useActionsStore((state) => state.backgroundColor);
    const workAreaColor = useActionsStore((state) => state.workAreaColor);

    const selectionBoxRef = useRef(null);
    const tr = useRef(null);

    const selectedIds = useNodeStore((state) => state.selectedIds);
    const setSelectedIds = useNodeStore.getState().setSelectedIds;

    console.log("RERENDER");

    const manager = useToolsManager(canvasRef, selectionBoxRef, tr);

    /* useEffect(() => {
        if (currentAction !== ACTIONS.select) {
            setSelectedIds([]);
        }
    }, [currentAction, setSelectedIds]); */

    const panZoom = usePanZoom();
    const onContextMenu = useContextMenuPos(canvasRef);
    useFitToFrame(canvasRef, size.width, size.height, width, height);

    // #region ??? transformer&selectedIds ???
    useEffect(() => {
        const stage = canvasRef.current;
        const transformer = tr.current;
        if (!stage || !transformer) return;
        const set = new Set(selectedIds);
        const nodes = stage.find(".node").filter((n) => set.has(n.id()));
        transformer.nodes(nodes);
    }, [selectedIds, canvasRef]);

    const handleStageClick = (e) => {
        if (currentAction !== ACTIONS.select) return;
        if (!e.target.hasName("node")) return;
        const clickedId = e.target.id();
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = selectedIds.includes(clickedId);
        if (!metaPressed && !isSelected) {
            setSelectedIds([clickedId]);
        } else if (metaPressed && isSelected) {
            setSelectedIds(selectedIds.filter((id) => id !== clickedId));
        } else if (metaPressed && !isSelected) {
            setSelectedIds([...selectedIds, clickedId]);
        }
    };
    // #endregion

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
            onClick={handleStageClick}
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
                <NodesLayer
                    width={size.width}
                    height={size.height}
                    gridSize={gridSize}
                    snapToGrid={snapToGrid}
                />
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
                    transformerRef={tr}
                    canvasRef={canvasRef}
                    gridSize={gridSize}
                    snapToGrid={snapToGrid}
                    workH={size.height}
                    workW={size.width}
                />
            </Layer>
        </Stage>
    );
};
