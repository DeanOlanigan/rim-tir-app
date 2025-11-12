import { useEffect, useMemo, useRef } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { Grid } from "./Grid";
import { useFitToFrame } from "./hooks/useFitToFrame";
import { useContextMenuPos } from "./hooks/useContextMenuPos";
import { usePanZoom } from "./hooks/usePanZoom";
import { NodesLayer } from "./layers/NodesLayer";
import { useActionsStore } from "../store/actions-store";
import { createSelectTool } from "./tools/select";
import { createHandTool } from "./tools/hand";
import { createDrawRectTool } from "./tools/drawRect";
import { useNodeStore } from "../store/node-store";
import { DEFAULT_MAX_ZOOM, DEFAULT_MIN_ZOOM } from "../constants";
import { HMITransformer } from "./HMITransformer";
import { ACTIONS } from "../store/actions";

export const HMICanvas = ({ canvasRef, width, height }) => {
    const currentAction = useActionsStore((state) => state.currentAction);
    const size = useActionsStore((state) => state.size);
    const gridSize = useActionsStore((state) => state.gridSize);
    const snapToGrid = useActionsStore((state) => state.snap);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const selectionBoxRef = useRef(null);
    const setSelectedIds = useNodeStore.getState().setSelectedIds;
    const backgroundColor = useActionsStore((state) => state.backgroundColor);
    const workAreaColor = useActionsStore((state) => state.workAreaColor);
    const tr = useRef(null);

    console.log("RERENDER");

    const toolset = useMemo(
        () => ({
            select: createSelectTool({
                selectionBoxRef,
                setSelectedIds: useNodeStore.getState().setSelectedIds,
                tr,
            }),
            hand: createHandTool({ stageRef: canvasRef }),
            square: createDrawRectTool({
                getStage: () => canvasRef.current,
                getGrid: () => ({ gridSize, snapToGrid }),
                getWorkSize: () => ({ workW: size.width, workH: size.height }),
                addNode: useNodeStore.getState().addNode,
                setSelectedIds: useNodeStore.getState().setSelectedIds,
            }),
        }),
        [canvasRef, gridSize, snapToGrid, size.width, size.height]
    );

    const activeToolRef = useRef(null);

    useEffect(() => {
        const tool = toolset[currentAction];
        activeToolRef.current = tool;
        const stage = canvasRef.current;
        if (stage) stage.container().style.cursor = tool?.cursor || "default";
    }, [currentAction, toolset, canvasRef]);

    useEffect(() => {
        if (currentAction !== ACTIONS.select) {
            setSelectedIds([]);
        }
    }, [currentAction, setSelectedIds]);

    const panZoom = usePanZoom(canvasRef, DEFAULT_MIN_ZOOM, DEFAULT_MAX_ZOOM);
    const onContextMenu = useContextMenuPos(canvasRef);
    const fitToFrame = useFitToFrame(
        canvasRef,
        size.width,
        size.height,
        width,
        height,
        DEFAULT_MIN_ZOOM,
        DEFAULT_MAX_ZOOM
    );

    useEffect(() => {
        fitToFrame();
    }, [fitToFrame]);

    useEffect(() => {
        const stage = canvasRef.current;
        const transformer = tr.current;
        if (!stage || !transformer) return;
        const set = new Set(selectedIds);
        const nodes = stage.find(".node").filter((n) => set.has(n.id()));
        transformer.nodes(nodes);
    }, [selectedIds, canvasRef]);

    const h = {
        onPointerDown: (e) => activeToolRef.current?.onPointerDown?.(e),
        onPointerMove: (e) => activeToolRef.current?.onPointerMove?.(e),
        onPointerUp: (e) => activeToolRef.current?.onPointerUp?.(e),
    };

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

    return (
        <Stage
            ref={canvasRef}
            width={width}
            height={height}
            onWheel={panZoom}
            {...h}
            style={{
                background: backgroundColor,
            }}
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
                <Grid
                    width={size.width}
                    height={size.height}
                    gridSize={gridSize}
                    stageRef={canvasRef}
                />
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
