import { memo, useCallback } from "react";
import { useActionsStore } from "../store/actions-store";
import { useNodeStore } from "../store/node-store";
import { Circle } from "react-konva";
import { toAbs, toWorld } from "./utils/coords";
import { snap } from "./utils/geom";

export const LineTransformer = memo(({ nodesRef, canvasRef }) => {
    const scale = useActionsStore((state) => state.scale);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const primaryNode = useNodeStore((state) => state.nodes[selectedIds[0]]);

    const dragBoundFunc = useCallback(function (pos) {
        const { gridSize, snapToGrid } = useActionsStore.getState();
        const stage = this.getStage();
        const step = snapToGrid ? gridSize : 1;
        const local = toWorld(stage, pos);
        const res = {
            x: snap(local.x, step, 0),
            y: snap(local.y, step, 0),
        };
        return toAbs(stage, res);
    }, []);

    const onDragMove = (e, pointIndex) => {
        const circle = e.target;
        const line = nodesRef.current.get(selectedIds[0]);
        const circlePos = circle.position();
        const oldPoints = line.points();
        if (!oldPoints || oldPoints.length < 4) return;
        let newPoints = oldPoints.slice();
        newPoints[pointIndex * 2] = circlePos.x;
        newPoints[pointIndex * 2 + 1] = circlePos.y;
        nodesRef.current.get(selectedIds[0])?.points(newPoints);
        canvasRef.current.batchDraw();
    };

    if (
        !primaryNode ||
        (primaryNode.type !== "line" && primaryNode.type !== "arrow")
    )
        return null;

    const points = nodesRef.current.get(primaryNode.id)?.points();
    if (points.length < 4) return null;

    const res = [];
    for (let i = 0; i < points.length; i += 2) {
        res.push(
            <Circle
                key={i}
                x={points[i]}
                y={points[i + 1]}
                scale={{ x: 1 / scale, y: 1 / scale }}
                radius={5}
                fill="white"
                stroke={"rgb(0, 161, 255)"}
                strokeWidth={1}
                draggable
                dragBoundFunc={dragBoundFunc}
                onDragMove={(e) => onDragMove(e, i / 2)}
            />
        );
    }
    return res;
});
LineTransformer.displayName = "LineTransformerNew";
