import Konva from "konva";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";

const NUMBER = 50;

// Helper functions for calculating bounding boxes of rotated rectangles
const degToRad = (angle) => (angle / 180) * Math.PI;

const getCorner = (pivotX, pivotY, diffX, diffY, angle) => {
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    angle += Math.atan2(diffY, diffX);
    const x = pivotX + distance * Math.cos(angle);
    const y = pivotY + distance * Math.sin(angle);
    return { x, y };
};

const getClientRect = (element) => {
    const { x, y, width, height, rotation = 0 } = element;
    const rad = degToRad(rotation);

    const p1 = getCorner(x, y, 0, 0, rad);
    const p2 = getCorner(x, y, width, 0, rad);
    const p3 = getCorner(x, y, width, height, rad);
    const p4 = getCorner(x, y, 0, height, rad);

    const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
    const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
    const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
    const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
};

export const Canvas = ({ width, height }) => {
    const [rectangles, setRectangles] = useState(
        Array(NUMBER)
            .fill()
            .map(() => ({
                x: width * Math.random(), // eslint-disable-line
                y: height * Math.random(), // eslint-disable-line
                width: 100,
                height: 90,
                fill: "red",
                id: nanoid(),
                name: "rect",
                rotation: 0,
            }))
    );
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectionRectangle, setSelectionRectangle] = useState({
        visible: false,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
    });
    const isSelecting = useRef(false);
    const transformerRef = useRef();
    const rectRefs = useRef(new Map());

    // Update transformer when selection changes
    useEffect(() => {
        if (selectedIds.length && transformerRef.current) {
            // Get the nodes from the refs Map
            const nodes = selectedIds
                .map((id) => rectRefs.current.get(id))
                .filter((node) => node);

            transformerRef.current.nodes(nodes);
        } else if (transformerRef.current) {
            // Clear selection
            transformerRef.current.nodes([]);
        }
    }, [selectedIds]);

    const handleMouseDown = (e) => {
        // Do nothing if we mousedown on any shape
        if (e.target !== e.target.getStage()) {
            return;
        }

        // Start selection rectangle
        isSelecting.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setSelectionRectangle({
            visible: true,
            x1: pos.x,
            y1: pos.y,
            x2: pos.x,
            y2: pos.y,
        });
    };

    const handleMouseMove = (e) => {
        // Do nothing if we didn't start selection
        if (!isSelecting.current) {
            return;
        }

        const pos = e.target.getStage().getPointerPosition();
        setSelectionRectangle((prev) => ({
            ...prev,
            x2: pos.x,
            y2: pos.y,
        }));
    };

    const handleMouseUp = () => {
        // Do nothing if we didn't start selection
        if (!isSelecting.current) {
            return;
        }
        isSelecting.current = false;

        // Update visibility in timeout, so we can check it in click event
        setTimeout(() => {
            setSelectionRectangle({
                ...selectionRectangle,
                visible: false,
            });
        });

        const selBox = {
            x: Math.min(selectionRectangle.x1, selectionRectangle.x2),
            y: Math.min(selectionRectangle.y1, selectionRectangle.y2),
            width: Math.abs(selectionRectangle.x2 - selectionRectangle.x1),
            height: Math.abs(selectionRectangle.y2 - selectionRectangle.y1),
        };

        const selected = rectangles.filter((rect) => {
            // Check if rectangle intersects with selection box
            return Konva.Util.haveIntersection(selBox, getClientRect(rect));
        });

        setSelectedIds(selected.map((rect) => rect.id));
    };

    // Click handler for stage
    const handleStageClick = (e) => {
        // If we are selecting with rect, do nothing
        if (selectionRectangle.visible) {
            return;
        }

        // If click on empty area - remove all selections
        if (e.target === e.target.getStage()) {
            setSelectedIds([]);
            return;
        }

        // Do nothing if clicked NOT on our rectangles
        if (!e.target.hasName("rect")) {
            return;
        }

        const clickedId = e.target.id();

        // Do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = selectedIds.includes(clickedId);

        if (!metaPressed && !isSelected) {
            // If no key pressed and the node is not selected
            // select just one
            setSelectedIds([clickedId]);
        } else if (metaPressed && isSelected) {
            // If we pressed keys and node was selected
            // we need to remove it from selection
            setSelectedIds(selectedIds.filter((id) => id !== clickedId));
        } else if (metaPressed && !isSelected) {
            // Add the node into selection
            setSelectedIds([...selectedIds, clickedId]);
        }
    };

    const handleDragEnd = (e) => {
        const id = e.target.id();
        setRectangles((prevRects) => {
            const newRects = [...prevRects];
            const index = newRects.findIndex((r) => r.id === id);
            if (index !== -1) {
                newRects[index] = {
                    ...newRects[index],
                    x: e.target.x(),
                    y: e.target.y(),
                };
            }
            return newRects;
        });
    };

    const handleTransformEnd = (e) => {
        // Find which rectangle(s) were transformed
        const id = e.target.id();
        const node = e.target;

        setRectangles((prevRects) => {
            const newRects = [...prevRects];

            // Update each transformed node
            const index = newRects.findIndex((r) => r.id === id);

            if (index !== -1) {
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                // Reset scale
                node.scaleX(1);
                node.scaleY(1);

                // Update the state with new values
                newRects[index] = {
                    ...newRects[index],
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(5, node.width() * scaleX),
                    height: Math.max(node.height() * scaleY),
                    rotation: node.rotation(),
                };
            }

            return newRects;
        });
    };

    return (
        <Stage
            width={width}
            height={height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleStageClick}
        >
            <Layer>
                {rectangles.map((rect) => (
                    <Rect
                        key={rect.id}
                        x={rect.x}
                        y={rect.y}
                        width={rect.width}
                        height={rect.height}
                        fill={rect.fill}
                        name={rect.name}
                        rotation={rect.rotation}
                        shadowBlur={10}
                        draggable
                        ref={(node) => {
                            if (node) {
                                rectRefs.current.set(rect.id, node);
                            }
                        }}
                        onDragEnd={handleDragEnd}
                        onTransformEnd={handleTransformEnd}
                    />
                ))}

                {/* Single transformer for all selected shapes */}
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // Limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />

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
                        fill="rgba(0, 0, 255, 0.2)"
                    />
                )}
            </Layer>
        </Stage>
    );
};
