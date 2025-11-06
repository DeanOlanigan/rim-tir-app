import { useEffect, useMemo, useRef, useState } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";
import { Grid } from "./Grid";
import { useColorMode } from "@/components/ui/color-mode";
import { useFitToFrame } from "./hooks/useFitToFrame";
import { useContextMenuPos } from "./hooks/useContextMenuPos";
import { usePanZoom } from "./hooks/usePanZoom";
import { useSelectionBox } from "./hooks/useSelectionBox";
import { NodesLayer } from "./layers/NodesLayer";
import { snap } from "./utils/geom";
import { clampRectInFrame } from "./utils/konva";
import { toWorld } from "./utils/coords";

export const HMICanvas = ({
    canvasRef,
    width,
    height,
    cWidth,
    cHeight,
    gridSize = 10,
    minZoom = 0.2,
    maxZoom = 10,
    snapToGrid,
    showGrid,
    setContextMenu,
}) => {
    const colorMode = useColorMode().colorMode;
    const frame = useMemo(
        () => ({
            x: 0,
            y: 0,
            width: cWidth,
            height: cHeight,
        }),
        [cWidth, cHeight]
    );

    const sel = useSelectionBox();
    const panZoom = usePanZoom(canvasRef, minZoom, maxZoom);
    const onContextMenu = useContextMenuPos(canvasRef, setContextMenu);
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
        const kd = (e) => panZoom.onKeyDown(e);
        const ku = (e) => panZoom.onKeyUp(e);
        window.addEventListener("keydown", kd, { passive: false });
        window.addEventListener("keyup", ku, { passive: false });
        return () => {
            window.removeEventListener("keydown", kd);
            window.removeEventListener("keyup", ku);
        };
    }, [panZoom]);

    const [selectedIds, setSelectedIds] = useState([]);
    console.log("selectedIds", selectedIds);
    const tr = useRef(null);

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
            onMouseDown={(e) => {
                panZoom.onMouseDown(e);
                sel.begin(e);
            }}
            onMouseMove={(e) => {
                panZoom.onMouseMove(e);
                sel.move(e);
            }}
            onMouseUp={(e) => {
                panZoom.onMouseUp(e);
                const r = sel.end(e);
                tr.current.nodes(r);
            }}
            style={{
                background: colorMode === "light" ? "#bffcbaff" : "#0e1d0dff",
            }}
            onContextMenu={onContextMenu}
        >
            <Layer listening={false} hitGraphEnabled={false}>
                <Rect
                    x={frame.x}
                    y={frame.y}
                    width={frame.width}
                    height={frame.height}
                    fill="#ffdadaff"
                />
                {showGrid && (
                    <Grid
                        frame={frame}
                        gridSize={gridSize}
                        color={"#7687d1ff"}
                        opacity={0.3}
                        majorEvery={25}
                        stageRef={canvasRef}
                    />
                )}
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
                    boundBoxFunc={(oldBox, newBox) => {
                        const step = snapToGrid ? gridSize : 1;

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
                    }}
                />
            </Layer>
            <Layer listening={false} hitGraphEnabled={false}>
                <Rect
                    ref={sel.box}
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
