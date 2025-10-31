import { useCallback, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { Grid } from "./Grid";

const SCROLL_STRENGTH = 25;

export const HMICanvas = ({
    canvasRef,
    width,
    height,
    cWidth,
    cHeight,
    gridSize = 10,
    minZoom = 0.2,
    maxZoom = 10,
}) => {
    const [rect, setRect] = useState({
        x: gridSize * 5,
        y: gridSize * 5,
        width: gridSize * 25,
        height: gridSize * 15,
        fill: "#fff",
        shadowBlur: 2,
        shadowColor: "black",
        shadowOffset: { x: 1, y: 1 },
        shadowOpacity: 0.4,
    });

    const handleDragEnd = (e) => {
        setRect((prev) => {
            return {
                ...prev,
                x: Math.round(e.target.x() / gridSize) * gridSize,
                y: Math.round(e.target.y() / gridSize) * gridSize,
            };
        });
    };

    const handleWheel = useCallback(
        (e) => {
            e.evt.preventDefault();

            const stage = canvasRef.current;
            if (!stage) return;

            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();
            const direction = e.evt.deltaY > 0 ? -1 : 1;

            if (e.evt.ctrlKey) {
                const zoom = 1 + direction * 0.1;
                const newScale = Math.min(
                    Math.max(oldScale * zoom, minZoom),
                    maxZoom
                );

                const mousePointTo = {
                    x: (pointer.x - stage.x()) / oldScale,
                    y: (pointer.y - stage.y()) / oldScale,
                };

                const newPos = {
                    x: pointer.x - mousePointTo.x * newScale,
                    y: pointer.y - mousePointTo.y * newScale,
                };

                stage.scale({ x: newScale, y: newScale });
                stage.position(newPos);
            } else if (e.evt.shiftKey) {
                const newPos = {
                    x: stage.x() + direction * SCROLL_STRENGTH,
                    y: stage.y(),
                };
                stage.position(newPos);
            } else {
                const newPos = {
                    x: stage.x(),
                    y: stage.y() + direction * SCROLL_STRENGTH,
                };
                stage.position(newPos);
            }

            stage.batchDraw();
        },
        [canvasRef, minZoom, maxZoom]
    );

    return (
        <Stage
            ref={canvasRef}
            width={width}
            height={height}
            onWheel={handleWheel}
            style={{
                background: "#bffcbaff",
            }}
            draggable
        >
            <Layer listening={false}>
                <Rect
                    x={0}
                    y={0}
                    width={cWidth}
                    height={cHeight}
                    fill="#ffdadaff"
                />
                <Grid
                    x={0}
                    y={0}
                    width={cWidth}
                    height={cHeight}
                    gridSize={gridSize}
                    color={"#7687d1ff"}
                    opacity={0.3}
                    majorEvery={5}
                    stageRef={canvasRef}
                />
            </Layer>
            <Layer>
                <Rect {...rect} draggable onDragEnd={handleDragEnd} />
            </Layer>
        </Stage>
    );
};
