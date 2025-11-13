import { Ellipse, Line, Rect } from "react-konva";
import { snap } from "../utils/geom";
import { clampPosInFrame } from "../utils/konva";
import { toAbs, toWorld } from "../utils/coords";
import { useActionsStore } from "../../store/actions-store";
import { useNodeStore } from "../../store/node-store";
import { ACTIONS } from "../../store/actions";
import { updateStoreNode } from "../utils/store";

export const NodesLayer = ({ width, height, gridSize, snapToGrid }) => {
    const clampToArea = useActionsStore((state) => state.clampToArea);
    const currentAction = useActionsStore((state) => state.currentAction);
    const nodes = useNodeStore((state) => state.nodes);
    const updateNode = useNodeStore.getState().updateNode;

    const handleDragEnd = (e) => {
        const node = e.target;
        updateStoreNode(node, updateNode);
    };

    const dragBoundFunc = function (pos) {
        const stage = this.getStage();
        const step = snapToGrid ? gridSize : 1;
        const local = toWorld(stage, pos);
        // TODO Ellipse wrong snap
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
            case "ellipse":
                return (
                    <Ellipse
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
            case "line":
                return (
                    <Line
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
