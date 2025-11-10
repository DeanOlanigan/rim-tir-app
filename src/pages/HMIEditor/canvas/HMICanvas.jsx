import { useEffect, useMemo, useRef } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";
import { Grid } from "./Grid";
import { useColorMode } from "@/components/ui/color-mode";
import { useFitToFrame } from "./hooks/useFitToFrame";
import { useContextMenuPos } from "./hooks/useContextMenuPos";
import { usePanZoom } from "./hooks/usePanZoom";
import { NodesLayer } from "./layers/NodesLayer";
import { toAbs, toWorld } from "./utils/coords";
import { useActionsStore } from "../store/actions-store";
import { snap } from "./utils/geom";
import { createSelectTool } from "./tools/select";
import { createHandTool } from "./tools/hand";
import { createDrawRectTool } from "./tools/drawRect";
import { useNodeStore } from "../store/node-store";

export const HMICanvas = ({
    canvasRef,
    width,
    height,
    minZoom = 0.2,
    maxZoom = 10,
}) => {
    const currentAction = useActionsStore((state) => state.currentAction);
    const size = useActionsStore((state) => state.size);
    const gridSize = useActionsStore((state) => state.gridSize);
    const snapToGrid = useActionsStore((state) => state.snap);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const selectionBoxRef = useRef(null);
    const addNode = useNodeStore.getState().addNode;
    const setSelectedIds = useNodeStore.getState().setSelectedIds;
    const backgroundColor = useActionsStore((state) => state.backgroundColor);
    const workAreaColor = useActionsStore((state) => state.workAreaColor);
    const gridColor = useActionsStore((state) => state.gridColor);

    console.log("RERENDER");

    //const colorMode = useColorMode().colorMode;
    const frame = useMemo(
        () => ({
            x: 0,
            y: 0,
            width: size.width,
            height: size.height,
        }),
        [size]
    );

    const depsRef = useRef({
        canvasRef,
        selectionBoxRef,
        frame,
        gridSize,
        snapToGrid,
        addNode,
        setSelectedIds,
    });
    useEffect(() => {
        depsRef.current.frame = frame;
        depsRef.current.gridSize = gridSize;
        depsRef.current.snapToGrid = snapToGrid;
    }, [frame, gridSize, snapToGrid]);

    const activeToolRef = useRef(null);
    const toolRef = useRef(null);
    if (!toolRef.current) {
        toolRef.current = {
            select: createSelectTool({
                selectionBoxRef,
                setSelectedIds,
            }),
            hand: createHandTool({ stageRef: canvasRef }),
            square: createDrawRectTool({ depsRef }),
        };
    }

    useEffect(() => {
        const tool = toolRef.current[currentAction];
        activeToolRef.current = tool;
        const stage = canvasRef.current;
        if (stage) stage.container().style.cursor = tool.cursor || "default";
    }, [currentAction, canvasRef]);

    //const sel = useSelectionBox();
    const panZoom = usePanZoom(canvasRef, minZoom, maxZoom);
    const onContextMenu = useContextMenuPos(canvasRef);
    const fitToFrame = useFitToFrame(
        canvasRef,
        frame,
        width,
        height,
        minZoom,
        maxZoom
    );

    useEffect(() => {
        fitToFrame();
    }, [fitToFrame]);

    useEffect(() => {
        const kd = (e) => activeToolRef.current?.onKeyDown?.(e);
        const ku = (e) => activeToolRef.current?.onKeyUp?.(e);
        window.addEventListener("keydown", kd, { passive: false });
        window.addEventListener("keyup", ku, { passive: false });
        return () => {
            window.removeEventListener("keydown", kd);
            window.removeEventListener("keyup", ku);
        };
    }, []);

    const h = {
        onMouseDown: (e) => activeToolRef.current?.onPointerDown?.(e),
        onMouseMove: (e) => activeToolRef.current?.onPointerMove?.(e),
        onMouseUp: (e) => activeToolRef.current?.onPointerUp?.(e),
    };

    const tr = useRef(null);

    useEffect(() => {
        if (!tr.current) return;
        tr.current.nodes(selectedIds);
    }, [selectedIds]);

    const handleStageClick = (e) => {
        if (e.target === e.target.getStage()) {
            setSelectedIds([]);
            tr.current.nodes([]);
            return;
        }

        if (!e.target.hasName("node")) return;

        const clickedId = e.target.id();

        // Do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = selectedIds.includes(clickedId);

        if (!metaPressed && !isSelected) {
            // If no key pressed and the node is not selected
            // select just one
            setSelectedIds([clickedId]);
            tr.current.nodes([e.target]);
        } else if (metaPressed && isSelected) {
            // If we pressed keys and node was selected
            // we need to remove it from selection
            setSelectedIds(selectedIds.filter((id) => id !== clickedId));
            const nodes = tr.current.nodes().slice();
            nodes.slice(nodes.indexOf(e.target), 1);
            tr.current.nodes(nodes);
        } else if (metaPressed && !isSelected) {
            // Add the node into selection
            setSelectedIds([...selectedIds, clickedId]);
            const nodes = tr.current.nodes().concat([e.target]);
            tr.current.nodes(nodes);
        }
    };

    return (
        <Stage
            ref={canvasRef}
            width={width}
            height={height}
            onWheel={panZoom.onWheel}
            {...h}
            style={{
                background: backgroundColor,
            }}
            onContextMenu={onContextMenu}
        >
            <Layer listening={false}>
                <Rect
                    x={frame.x}
                    y={frame.y}
                    width={frame.width}
                    height={frame.height}
                    fill={workAreaColor}
                />
                <Grid
                    frame={frame}
                    gridSize={gridSize}
                    color={gridColor}
                    opacity={0.3}
                    majorEvery={25}
                    stageRef={canvasRef}
                />
            </Layer>
            <NodesLayer
                frame={frame}
                gridSize={gridSize}
                snapToGrid={snapToGrid}
            />
            <Layer>
                <Transformer
                    ref={tr}
                    keepRatio={false}
                    rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315, 360]}
                    rotationSnapTolerance={30}
                    anchorDragBoundFunc={function (oldPos, newPos) {
                        const stage = canvasRef.current;
                        const step = snapToGrid ? gridSize : 1;

                        const w = toWorld(stage, newPos);

                        const nx = snap(w.x, step, frame.x);
                        const ny = snap(w.y, step, frame.y);

                        const cx = Math.min(
                            Math.max(nx, frame.x),
                            frame.x + frame.width
                        );
                        const cy = Math.min(
                            Math.max(ny, frame.y),
                            frame.y + frame.height
                        );

                        const abs = toAbs(stage, { x: cx, y: cy });

                        return abs;
                    }}
                    /* boundBoxFunc={(oldBox, newBox) => {
                        const stage = canvasRef.current;
                        const step = snapToGrid ? gridSize: 1;

                        const anchor = tr.current?.getActiveAnchor?.() || null;
                        console.log(anchor);

                        const wp = toWorld(canvasRef.current, {
                            x: newBox.x,
                            y: newBox.y,
                        });
                        const wpx = snap(wp.x, step, frame.x);
                        const wpy = snap(wp.y, step, frame.y);

                        const nx = snap(newBox.x, step, frame.x);
                        const ny = snap(newBox.y, step, frame.y);
                        const nw = Math.max(step, snap(newBox.width, step));
                        const nh = Math.max(step, snap(newBox.height, step));
                        const r = newBox.rotation;

                        const newBoxSnapped = {
                            x: nx,
                            y: ny,
                            width: nw,
                            height: nh,
                            rotation: r,
                        };
                        console.log(newBox, newBoxSnapped, { x: wpx, y: wpy });
                        return newBoxSnapped;
                    }} */
                />
            </Layer>
            <Layer listening={false} id="DraftLayer" />
            <Layer listening={false}>
                <Rect
                    ref={selectionBoxRef}
                    visible={false}
                    fill={"hsla(205, 90%, 48%, 0.1)"}
                    stroke={"hsla(205, 90%, 48%, 1)"}
                    strokeScaleEnabled={false}
                    strokeWidth={1}
                />
            </Layer>
        </Stage>
    );
};
