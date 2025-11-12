import { Circle, Rect } from "react-konva";
import { snap } from "../utils/geom";
import { clampPosInFrame } from "../utils/konva";
import { toAbs, toWorld } from "../utils/coords";
import { useActionsStore } from "../../store/actions-store";
import { useNodeStore } from "../../store/node-store";
import { ACTIONS } from "../../store/actions";

export const NodesLayer = ({ width, height, gridSize, snapToGrid }) => {
    const clampToArea = useActionsStore((state) => state.clampToArea);
    const currentAction = useActionsStore((state) => state.currentAction);
    const nodes = useNodeStore((state) => state.nodes);
    const updateNode = useNodeStore.getState().updateNode;

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
            x: snap(local.x, step, 0),
            y: snap(local.y, step, 0),
        };
        if (clampToArea) {
            res = clampPosInFrame(this, width, height, res);
        }
        const abs = toAbs(stage, res);
        return abs;
    };

    const mouseOverHandler = (e) => {
        if (currentAction !== ACTIONS.select) return;
        e.target.getStage().container().style.cursor = "move";
    };

    const mouseOutHandler = (e) => {
        if (currentAction !== ACTIONS.select) return;
        e.target.getStage().container().style.cursor = "default";
    };

    return Object.values(nodes).map((node) => {
        switch (node.type) {
            case "rect":
                return (
                    <Rect
                        key={node.id}
                        name="node"
                        {...node}
                        draggable={currentAction === ACTIONS.select}
                        dragBoundFunc={dragBoundFunc}
                        onDragEnd={handleDragEnd}
                        onMouseOver={mouseOverHandler}
                        onMouseOut={mouseOutHandler}
                    />
                );
            case "circle":
                return (
                    <Circle
                        key={node.id}
                        name="node"
                        {...node}
                        draggable={currentAction === ACTIONS.select}
                        dragBoundFunc={dragBoundFunc}
                        onDragEnd={handleDragEnd}
                        onMouseOver={mouseOverHandler}
                        onMouseOut={mouseOutHandler}
                    />
                );
        }
    });
};
