import { Circle, Layer, Rect } from "react-konva";
import { snap } from "../utils/geom";
import { clampPosInFrame } from "../utils/konva";
//import { useState } from "react";
import { nanoid } from "nanoid";
import { toAbs, toWorld } from "../utils/coords";
import { useActionsStore } from "../../store/actions-store";
import { useNodeStore } from "../../store/node-store";

export const NodesLayer = ({ frame, gridSize, snapToGrid }) => {
    const clampToArea = useActionsStore((state) => state.clampToArea);
    const nodes = useNodeStore((state) => state.nodes);
    console.log("NODES", nodes);

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

    /* const handleDragMove = (e) => {
        //const { x, y } = e.target.position();
        const node = e.target;
        const step = snapToGrid ? gridSize : 1;
        console.log("move", { x: node.x(), y: node.y() });
        const nx = snap(node.x(), step, frame.x);
        const ny = snap(node.y(), step, frame.y);
        const clamped = clampPosInFrame(node, frame, { x: nx, y: ny });
        node.position(clamped);
        node.getLayer()?.batchDraw();
    }; */

    /* const handleDragEnd = (e) => {
        const node = e.target;
        const step = snapToGrid ? gridSize : 1;
        const nx = snap(node.x(), step, frame.x);
        const ny = snap(node.y(), step, frame.y);
        const clamped = clampPosInFrame(node, frame, { x: nx, y: ny });
        setRect((prev) => ({ ...prev, ...clamped }));
    }; */

    const dragBoundFunc = function (pos) {
        const stage = this.getStage();
        const step = snapToGrid ? gridSize : 1;
        const local = toWorld(stage, pos);
        let res = {
            x: snap(local.x, step, frame.x),
            y: snap(local.y, step, frame.y),
        };
        if (clampToArea) {
            res = clampPosInFrame(this, frame, res);
        }
        const abs = toAbs(stage, res);
        return abs;
    };

    return (
        <Layer>
            <Rect
                id={nanoid(12)}
                name="node"
                x={20}
                y={20}
                width={20}
                height={20}
                fill="#fff"
                stroke="black"
                strokeWidth={2}
                fillAfterStrokeEnabled={true}
                draggable
                cornerRadius={2}
                dragBoundFunc={dragBoundFunc}
            />
            <Circle
                id={nanoid(12)}
                name="node"
                x={40}
                y={40}
                width={20}
                height={20}
                fill="#8fda93ff"
                stroke="black"
                strokeWidth={2}
                fillAfterStrokeEnabled={true}
                draggable
                dragBoundFunc={dragBoundFunc}
            />
            {nodes.map(
                (node) =>
                    node.type === "rect" && (
                        <Rect
                            key={node.id}
                            id={node.id}
                            name="node"
                            x={node.x}
                            y={node.y}
                            width={node.width}
                            height={node.height}
                            fill={node.fill}
                            stroke={node.stroke}
                            strokeWidth={node.strokeWidth}
                            fillAfterStrokeEnabled={node.fillAfterStrokeEnabled}
                            draggable
                            cornerRadius={node.cornerRadius}
                            dragBoundFunc={dragBoundFunc}
                        />
                    )
            )}
        </Layer>
    );
};
