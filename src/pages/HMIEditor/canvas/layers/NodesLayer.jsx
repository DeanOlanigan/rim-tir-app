import { Circle, Rect } from "react-konva";
import { snap } from "../utils/geom";
import { clampPosInFrame } from "../utils/konva";
import { toAbs, toWorld } from "../utils/coords";
import { useActionsStore } from "../../store/actions-store";
import { useNodeStore } from "../../store/node-store";

export const NodesLayer = ({ frame, gridSize, snapToGrid }) => {
    const clampToArea = useActionsStore((state) => state.clampToArea);
    const nodes = useNodeStore((state) => state.nodes);
    const updateNode = useNodeStore.getState().updateNode;

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

    const handleDragEnd = (e) => {
        const node = e.target;
        const data = {
            type: node.attrs.type,
            id: node.attrs.id,
            x: node.attrs.x,
            y: node.attrs.y,
            fill: node.attrs.fill,
            stroke: node.attrs.stroke,
            strokeWidth: node.attrs.strokeWidth,
            fillAfterStrokeEnabled: node.attrs.fillAfterStrokeEnabled,
            cornerRadius: node.attrs.cornerRadius,
        };
        if (node.attrs.type === "rect") {
            data.width = node.attrs.width;
            data.height = node.attrs.height;
        }
        if (node.attrs.type === "circle") {
            data.radius = node.attrs.radius;
        }
        updateNode(node.attrs.id, data);
    };

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

    return Object.values(nodes).map((node) => {
        switch (node.type) {
            case "rect":
                return (
                    <Rect
                        key={node.id}
                        name="node"
                        {...node}
                        draggable
                        dragBoundFunc={dragBoundFunc}
                        onDragEnd={handleDragEnd}
                    />
                );
            case "circle":
                return (
                    <Circle
                        key={node.id}
                        name="node"
                        {...node}
                        draggable
                        dragBoundFunc={dragBoundFunc}
                        onDragEnd={handleDragEnd}
                    />
                );
        }
    });
};
