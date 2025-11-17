import { Arrow, Ellipse, Line, Rect } from "react-konva";
import { snap } from "../utils/geom";
import { clampPosInFrame } from "../utils/konva";
import { toAbs, toWorld } from "../utils/coords";
import { useActionsStore } from "../../store/actions-store";
import { useNodeStore } from "../../store/node-store";
import { ACTIONS } from "../../store/actions";

export const NodesLayer = () => {
    const size = useActionsStore((state) => state.size);
    const currentAction = useActionsStore((state) => state.currentAction);
    const gridSize = useActionsStore((state) => state.gridSize);
    const snapToGrid = useActionsStore((state) => state.snap);
    const nodes = useNodeStore((state) => state.nodes);

    const handleDragEnd = (e) => {
        const nodeId = e.target.attrs?.id;
        if (!nodeId) return;
        useNodeStore.getState().updateNode(nodeId, {
            x: Math.round(e.target.x()),
            y: Math.round(e.target.y()),
        });
    };

    const dragBoundFunc = function (pos) {
        const stage = this.getStage();
        const step = snapToGrid ? gridSize : 1;
        const local = toWorld(stage, pos);
        // TODO Ellipse wrong snap
        let res = local;
        if (this.attrs.type === "rect") {
            res = {
                x: snap(local.x, step, 0),
                y: snap(local.y, step, 0),
            };
        }
        //res = clampPosInFrame(this, width, height, res);
        const abs = toAbs(stage, res);
        // FIXME Broken while zoom
        return abs;
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
