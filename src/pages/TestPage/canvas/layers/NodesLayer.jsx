import { Layer, Rect } from "react-konva";
import { snap } from "../utils/geom";
import { clampPosInFrame } from "../utils/konva";
//import { useState } from "react";
import { nanoid } from "nanoid";

export const NodesLayer = ({ frame, gridSize, snapToGrid }) => {
    /* const [rect, setRect] = useState({
        id: nanoid(12),
        x: 20,
        y: 20,
        width: 25,
        height: 15,
        fill: "#fff",
        stroke: "black",
        strokeWidth: 0,
        fillAfterStrokeEnabled: true,
        draggable: true,
        cornerRadius: 2,
    }); */

    const handleDragMove = (e) => {
        //const { x, y } = e.target.position();
        const node = e.target;
        const step = snapToGrid ? gridSize : 1;
        const nx = snap(node.x(), step, frame.x);
        const ny = snap(node.y(), step, frame.y);
        console.log({ x: node.x(), y: node.y() }, { x: nx, y: ny });
        const clamped = clampPosInFrame(node, frame, { x: nx, y: ny });
        node.position(clamped);
        node.getLayer()?.batchDraw();
    };

    /* const handleDragEnd = (e) => {
        const node = e.target;
        const step = snapToGrid ? gridSize : 1;
        const nx = snap(node.x(), step, frame.x);
        const ny = snap(node.y(), step, frame.y);
        const clamped = clampPosInFrame(node, frame, { x: nx, y: ny });
        setRect((prev) => ({ ...prev, ...clamped }));
    }; */

    return (
        <Layer>
            <Rect
                id={nanoid(12)}
                name="node"
                x={20}
                y={20}
                width={25}
                height={15}
                fill="#fff"
                stroke="black"
                strokeWidth={0}
                fillAfterStrokeEnabled={true}
                draggable
                cornerRadius={2}
                onDragMove={handleDragMove}
                //onDragEnd={handleDragEnd}
            />
        </Layer>
    );
};
