import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { Grid } from "./Grid";
import { useColorMode } from "@/components/ui/color-mode";

const SCROLL_STRENGTH = 25;

function toWorld(stage, point) {
    const tr = stage.getAbsoluteTransform().copy();
    tr.invert();
    return tr.point(point);
}

const toAbs = (stage, worldPoint) => {
    const t = stage.getAbsoluteTransform().copy();
    return t.point(worldPoint); // world -> abs
};

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}

function snap(v, step, origin = 0) {
    if (step <= 0) return v;
    return Math.round((v - origin) / step) * step + origin;
}

function clampPosInFrame(node, frame, pos) {
    const { width: ow, height: oh, pad } = getOuterSize(node);
    const minX = frame.x + pad;
    const minY = frame.y + pad;
    const maxX = frame.x + frame.width - ow + pad;
    const maxY = frame.y + frame.height - oh + pad;
    return {
        x: Math.min(Math.max(pos.x, minX), maxX),
        y: Math.min(Math.max(pos.y, minY), maxY),
    };
}

function getOuterSize(node) {
    const sx = node.scaleX() || 1;
    const sy = node.scaleY() || 1;
    const w = (node.width() || 0) * sx;
    const h = (node.height() || 0) * sy;

    const sw = node.strokeEnabled?.() === false ? 0 : node.strokeWidth?.() || 0;
    const half = sw / 2;

    return { width: w + sw, height: h + sw, pad: half };
}

// Получает AABB-бокс фигуры в координатах родителя
const getBBox = (node) =>
    node.getClientRect({ skipShadow: true, skipStroke: false });

const clampByBBox = (node, frame, pos) => {
    // временно выставим позицию, чтобы посчитать бокс в этой точке
    const old = node.position();
    node.position(pos);
    const boxAbs = getBBox(node); // { x, y, width, height } уже с учётом scale/rotation/stroke
    const box = toWorld(node.getStage(), { x: boxAbs.x, y: boxAbs.y });

    // если вылезает — сдвигаем так, чтобы box вписался
    let dx = 0,
        dy = 0;
    if (box.x < frame.x) dx = frame.x - box.x;
    if (box.y < frame.y) dy = frame.y - box.y;
    if (box.x + box.width > frame.x + frame.width)
        dx = frame.x + frame.width - (box.x + box.width);
    if (box.y + box.height > frame.y + frame.height)
        dy = frame.y + frame.height - (box.y + box.height);
    node.position(old); // откатили
    return { x: pos.x + dx, y: pos.y + dy };
};

function makeDragBoundFunc({ frame, gridSize }) {
    return function (pos) {
        const node = this;
        const nx = snap(pos.x, gridSize, frame.x);
        const ny = snap(pos.y, gridSize, frame.y);
        return clampPosInFrame(node, frame, { x: nx, y: ny });
    };
}

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
    setMenuPosition,
    setShowMenu,
}) => {
    const colorMode = useColorMode().colorMode;
    const FRAME = useMemo(
        () => ({
            x: 0,
            y: 0,
            width: cWidth,
            height: cHeight,
        }),
        [cWidth, cHeight]
    );

    const [selectionRectangle, setSelectionRectangle] = useState({
        visible: false,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
    });

    const [rect, setRect] = useState({
        x: gridSize * 0,
        y: gridSize * 0,
        width: gridSize * 25,
        height: gridSize * 15,
        fill: "#fff",
        stroke: "black",
        strokeWidth: 0,
        fillAfterStrokeEnabled: true,
        draggable: true,
        cornerRadius: 2,
    });

    const isSpacePressedRef = useRef(false);
    const isPanningRef = useRef(false);
    const panStartRef = useRef({
        stageX: 0,
        stageY: 0,
        pointerX: 0,
        pointerY: 0,
    });
    const isSelectingRef = useRef(false);

    const handleDragMove = useCallback(
        (e) => {
            //const { x, y } = e.target.position();
            const node = e.target;
            const step = snapToGrid ? gridSize : 1;
            const nx = snap(node.x(), step, FRAME.x);
            const ny = snap(node.y(), step, FRAME.y);
            const clamped = clampPosInFrame(node, FRAME, { x: nx, y: ny });
            node.position(clamped);
            node.getLayer()?.batchDraw();
        },
        [gridSize, FRAME, snapToGrid]
    );

    const handleDragEnd = useCallback(
        (e) => {
            const node = e.target;
            const step = snapToGrid ? gridSize : 1;
            const nx = snap(node.x(), step, FRAME.x);
            const ny = snap(node.y(), step, FRAME.y);
            const clamped = clampPosInFrame(node, FRAME, { x: nx, y: ny });
            setRect((prev) => ({ ...prev, ...clamped }));
        },
        [gridSize, FRAME, snapToGrid]
    );

    const zoomAt = useCallback((stage, pointer, nextScale) => {
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };
        stage.scale({ x: nextScale, y: nextScale });
        const newPos = {
            x: pointer.x - mousePointTo.x * nextScale,
            y: pointer.y - mousePointTo.y * nextScale,
        };
        stage.position(newPos);
    }, []);

    const handleWheel = useCallback(
        (e) => {
            e.evt.preventDefault();

            const stage = canvasRef.current;
            if (!stage) return;

            const pointer = stage.getPointerPosition();
            const oldScale = stage.scaleX();
            const direction = e.evt.deltaY > 0 ? -1 : 1;

            if (e.evt.ctrlKey) {
                const zoomFactor = 1 + direction * 0.1;
                const next = clamp(oldScale * zoomFactor, minZoom, maxZoom);
                zoomAt(stage, pointer, next);
            } else if (e.evt.shiftKey) {
                stage.position({
                    x: stage.x() + direction * SCROLL_STRENGTH,
                    y: stage.y(),
                });
            } else {
                stage.position({
                    x: stage.x(),
                    y: stage.y() + direction * SCROLL_STRENGTH,
                });
            }

            stage.batchDraw();
        },
        [canvasRef, minZoom, maxZoom, zoomAt]
    );

    const onMouseDown = useCallback(
        (e) => {
            const stage = canvasRef.current;
            if (!stage) return;
            if (isSpacePressedRef.current || e.evt.button === 1) {
                const pointer = stage.getPointerPosition();
                panStartRef.current = {
                    stageX: stage.x(),
                    stageY: stage.y(),
                    pointerX: pointer.x,
                    pointerY: pointer.y,
                };
                isPanningRef.current = true;
                stage.container().style.cursor = "grabbing";
            }
            if (e.target !== e.target.getStage()) return;
            isSelectingRef.current = true;
            const pointer = toWorld(stage, stage.getPointerPosition());
            setSelectionRectangle({
                visible: true,
                x1: pointer.x,
                y1: pointer.y,
                x2: pointer.x,
                y2: pointer.y,
            });
        },
        [canvasRef]
    );

    const onMouseMove = useCallback(() => {
        const stage = canvasRef.current;
        if (!stage) return;
        if (isPanningRef.current) {
            const pointer = stage.getPointerPosition();
            const dx = pointer.x - panStartRef.current.pointerX;
            const dy = pointer.y - panStartRef.current.pointerY;
            stage.position({
                x: panStartRef.current.stageX + dx,
                y: panStartRef.current.stageY + dy,
            });
            stage.batchDraw();
            stage.container().style.cursor = "grabbing";
        }
        if (isSelectingRef.current) {
            const pointer = toWorld(stage, stage.getPointerPosition());
            setSelectionRectangle((prev) => ({
                ...prev,
                x2: pointer.x,
                y2: pointer.y,
            }));
        }
    }, [canvasRef]);

    const endPan = useCallback(() => {
        const stage = canvasRef.current;
        if (!stage) return;
        isPanningRef.current = false;
        if (isSpacePressedRef.current) stage.container().style.cursor = "grab";
        else stage.container().style.cursor = "default";

        if (isSelectingRef.current) {
            isSelectingRef.current = false;
            setTimeout(() => {
                setSelectionRectangle({
                    ...selectionRectangle,
                    visible: false,
                });
            });
        }
    }, [canvasRef, selectionRectangle]);

    const onKeyDown = useCallback(
        (e) => {
            if (e.code === "Space") {
                if (isSpacePressedRef.current) return;
                isSpacePressedRef.current = true;
                const stage = canvasRef.current;
                if (stage) stage.container().style.cursor = "grab";
                e.preventDefault();
            }
        },
        [canvasRef]
    );

    const onKeyUp = useCallback(
        (e) => {
            if (e.code === "Space") {
                isSpacePressedRef.current = false;
                const stage = canvasRef.current;
                if (stage && !isSpacePressedRef.current)
                    stage.container().style.cursor = "default";
                e.preventDefault();
            }
        },
        [canvasRef]
    );

    const handleContextMenu = useCallback(
        (e) => {
            e.evt.preventDefault();
            if (e.target === e.target.getStage()) return;
            const stage = canvasRef.current;
            const containerRect = stage.container().getBoundingClientRect();
            const pointerPosition = stage.getPointerPosition();
            setMenuPosition({
                x: containerRect.left + pointerPosition.x + 4,
                y: containerRect.top + pointerPosition.y + 4,
            });
            setShowMenu(true);
            e.cancelBubble = true;
        },
        [canvasRef, setMenuPosition, setShowMenu]
    );

    const fitToFrame = useCallback(() => {
        const stage = canvasRef.current;
        if (!stage) return;

        const pad = 0.85;
        const scale = Math.max(
            minZoom,
            Math.min(
                maxZoom,
                Math.min(
                    (width / FRAME.width) * pad,
                    (height / FRAME.height) * pad
                )
            )
        );

        stage.scale({ x: scale, y: scale });
        const x = (width - FRAME.width * scale) / 2 - FRAME.x * scale;
        const y = (height - FRAME.height * scale) / 2 - FRAME.y * scale;
        stage.position({ x: x || 0, y: y || 0 });
        stage.batchDraw();
    }, [width, height, canvasRef, FRAME, minZoom, maxZoom]);

    useEffect(() => {
        fitToFrame();
    }, [fitToFrame]);

    useEffect(() => {
        const onWindowKeyDown = (e) => onKeyDown(e);
        const onWindowKeyUp = (e) => onKeyUp(e);
        window.addEventListener("keydown", onWindowKeyDown, { passive: false });
        window.addEventListener("keyup", onWindowKeyUp, { passive: false });
        return () => {
            window.removeEventListener("keydown", onWindowKeyDown);
            window.removeEventListener("keyup", onWindowKeyUp);
        };
    }, [onKeyDown, onKeyUp]);

    useEffect(() => {
        // Hide menu on window click
        const handleWindowClick = () => {
            setShowMenu(false);
        };
        window.addEventListener("click", handleWindowClick);

        return () => {
            window.removeEventListener("click", handleWindowClick);
        };
    }, [setShowMenu]);

    return (
        <Stage
            ref={canvasRef}
            width={width}
            height={height}
            onWheel={handleWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={endPan}
            style={{
                background: colorMode === "light" ? "#bffcbaff" : "#0e1d0dff",
            }}
            onContextMenu={handleContextMenu}
        >
            <Layer listening={false}>
                <Rect
                    x={FRAME.x}
                    y={FRAME.y}
                    width={FRAME.width}
                    height={FRAME.height}
                    fill="#ffdadaff"
                />
                {showGrid && (
                    <Grid
                        frame={FRAME}
                        gridSize={gridSize}
                        color={"#7687d1ff"}
                        opacity={0.3}
                        majorEvery={25}
                        stageRef={canvasRef}
                    />
                )}
            </Layer>
            <Layer>
                <Rect
                    {...rect}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    /* dragBoundFunc={makeDragBoundFunc({
                        frame: FRAME,
                        gridSize,
                    })} */
                />
            </Layer>
            <Layer listening={false}>
                {selectionRectangle.visible && (
                    <Rect
                        x={Math.min(
                            selectionRectangle.x1,
                            selectionRectangle.x2
                        )}
                        y={Math.min(
                            selectionRectangle.y1,
                            selectionRectangle.y2
                        )}
                        width={Math.abs(
                            selectionRectangle.x2 - selectionRectangle.x1
                        )}
                        height={Math.abs(
                            selectionRectangle.y2 - selectionRectangle.y1
                        )}
                        fill="rgba(0, 0, 255, 0.15)"
                    />
                )}
            </Layer>
        </Stage>
    );
};
