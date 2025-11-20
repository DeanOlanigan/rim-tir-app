import { Arrow, Ellipse, Line, Rect } from "react-konva";
import { toAbs, toWorld } from "./utils/coords";
import { useActionsStore } from "./../store/actions-store";
import { useNodeStore } from "./../store/node-store";
import { snap } from "./utils/geom";
import { ACTIONS } from "../constants";

export const Nodes = () => {
    const currentAction = useActionsStore((state) => state.currentAction);
    const gridSize = useActionsStore((state) => state.gridSize);
    const snapToGrid = useActionsStore((state) => state.snap);
    const nodes = useNodeStore((state) => state.nodes);

    const handleDragEnd = (e) => {
        const nodeId = e.target.attrs?.id;
        if (!nodeId) return;
        useNodeStore.getState().updateNode(nodeId, {
            x: e.target.x(),
            y: e.target.y(),
        });
    };

    const dragBoundFunc = function (pos) {
        const stage = this.getStage();
        const step = snapToGrid ? gridSize : 1;
        const absRect = this.getClientRect({
            skipShadow: true,
            skipStroke: true,
        });
        const curAbsPos = this.getAbsolutePosition();

        const absTlCurrent = {
            x: absRect.x,
            y: absRect.y,
        };
        const deltaPos = {
            x: pos.x - curAbsPos.x,
            y: pos.y - curAbsPos.y,
        };
        const absTlProposed = {
            x: absTlCurrent.x + deltaPos.x,
            y: absTlCurrent.y + deltaPos.y,
        };

        const local = toWorld(stage, absTlProposed);
        const res = {
            x: snap(local.x, step, 0),
            y: snap(local.y, step, 0),
        };
        const abs = toAbs(stage, res);

        const delta = {
            x: abs.x - absTlProposed.x,
            y: abs.y - absTlProposed.y,
        };

        return {
            x: pos.x + delta.x,
            y: pos.y + delta.y,
        };
    };

    const common = {
        name: "node",
        draggable: currentAction === ACTIONS.select,
        dragBoundFunc,
        onDragEnd: handleDragEnd,
    };

    return Object.values(nodes).map((node) => {
        switch (node.type) {
            case "rect":
                return <Rect key={node.id} {...node} {...common} />;
            case "ellipse":
                return <Ellipse key={node.id} {...node} {...common} />;
            case "line":
                return <Line key={node.id} {...node} {...common} />;
            case "arrow":
                return <Arrow key={node.id} {...node} {...common} />;
        }
    });
};
