import { memo, useCallback } from "react";
import { useActionsStore } from "../store/actions-store";
import { useNodeStore } from "../store/node-store";
import { Circle } from "react-konva";
import { toAbs, toWorld } from "./utils/coords";
import { snap } from "./utils/geom";

export const LineTransformerNew = memo(({ nodesRef, canvasRef }) => {
    const scale = useActionsStore((state) => state.scale);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const gridSize = useActionsStore((state) => state.gridSize);
    const snapToGrid = useActionsStore((state) => state.snap);
    const primaryNode = useNodeStore((state) => state.nodes[selectedIds[0]]);

    const dragBoundFunc = useCallback(
        function (pos) {
            const stage = this.getStage();
            const step = snapToGrid ? gridSize : 1;
            const local = toWorld(stage, pos);
            const res = {
                x: snap(local.x, step, 0),
                y: snap(local.y, step, 0),
            };
            return toAbs(stage, res);
        },
        [gridSize, snapToGrid]
    );

    const onDragMove = (e, pointIndex) => {
        const node = e.target;
        const points = node.points();
        if (!points || points.length < 4) return;
        const pos = node.position();
        let newPoints = points.slice();
        newPoints[pointIndex * 2] = pos.x;
        newPoints[pointIndex * 2 + 1] = pos.y;
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

    const [x1, y1, x2, y2] = points;

    return (
        <>
            <Circle
                x={x1}
                y={y1}
                scale={{ x: 1 / scale, y: 1 / scale }}
                radius={5}
                fill="white"
                stroke={"rgb(0, 161, 255)"}
                strokeWidth={1}
                draggable
                dragBoundFunc={dragBoundFunc}
                onDragMove={onDragMove}
            />
            <Circle
                x={x2}
                y={y2}
                scale={{ x: 1 / scale, y: 1 / scale }}
                radius={5}
                fill="white"
                stroke={"rgb(0, 161, 255)"}
                strokeWidth={1}
                draggable
                dragBoundFunc={dragBoundFunc}
                onDragMove={onDragMove}
            />
        </>
    );
});
LineTransformerNew.displayName = "LineTransformerNew";
