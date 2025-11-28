import { memo, useCallback, useEffect, useRef } from "react";
import { useActionsStore } from "../store/actions-store";
import { useNodeStore } from "../store/node-store";
import { Circle } from "react-konva";
import { dragBound } from "./utils/dragBound";

export const LineTransformer = memo(({ nodesRef, canvasRef, overviewRef }) => {
    const scale = useActionsStore((state) => state.scale);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const primaryNode = useNodeStore((state) => state.nodes[selectedIds[0]]);
    const startPos = useRef(null);

    const dragBoundFunc = useCallback(function (pos) {
        const { gridSize, snapToGrid } = useActionsStore.getState();
        const stage = this.getStage();
        return dragBound(pos, stage, gridSize, snapToGrid);
    }, []);

    const onDragMove = (e, pointIndex) => {
        const circle = e.target;
        const circlePos = circle.position();
        const oldPoints = line.points();
        if (!oldPoints || oldPoints.length < 4) return;

        const newPoints = oldPoints.slice();

        if (pointIndex === 0) {
            const worldFirstX = line.x() + oldPoints[0];
            const worldFirstY = line.y() + oldPoints[1];

            const targetX = circlePos.x;
            const targetY = circlePos.y;

            const dxLine = targetX - worldFirstX;
            const dyLine = targetY - worldFirstY;

            const newLineX = line.x() + dxLine;
            const newLineY = line.y() + dyLine;

            for (let i = 0; i < newPoints.length; i += 2) {
                newPoints[i] -= dxLine;
                newPoints[i + 1] -= dyLine;
            }

            newPoints[0] = 0;
            newPoints[1] = 0;

            line.x(newLineX);
            line.y(newLineY);
            line.points(newPoints);
        } else {
            newPoints[pointIndex * 2] = circlePos.x - line.x();
            newPoints[pointIndex * 2 + 1] = circlePos.y - line.y();
            line.points(newPoints);
        }

        canvasRef.current.batchDraw();
    };

    const onNodeMoveStart = useCallback((e) => {
        const node = e.target;
        startPos.current = node.position();
    }, []);

    const onNodeMove = useCallback(
        (e) => {
            const node = e.target;
            const circles = overviewRef.current.find(".line-drag-handle");
            const dx = node.x() - startPos.current.x;
            const dy = node.y() - startPos.current.y;
            circles.forEach((c) =>
                c.position({ x: c.x() + dx, y: c.y() + dy })
            );
            startPos.current = node.position();
        },
        [overviewRef]
    );

    useEffect(() => {
        if (
            !primaryNode ||
            (primaryNode.type !== "line" && primaryNode.type !== "arrow")
        )
            return;
        const node = nodesRef.current.get(primaryNode.id);
        node.on("dragmove.ltr", onNodeMove);
        node.on("dragstart.ltr", onNodeMoveStart);
        return () => {
            node.off(".ltr");
        };
    }, [primaryNode, nodesRef, onNodeMove, onNodeMoveStart]);

    if (
        !primaryNode ||
        (primaryNode.type !== "line" && primaryNode.type !== "arrow")
    )
        return null;

    const line = nodesRef.current.get(primaryNode.id);
    console.log({ x: line.x(), y: line.y(), points: line.points() });
    const points = line.points();
    if (points.length < 4) return null;

    /* const midPoints = [];
    for (let i = 0; i < points.length / 2 - 1; i++) {
        midPoints.push(
            ...pointBetweenPoints(
                [points[i * 2], points[i * 2 + 1]],
                [points[(i + 1) * 2], points[(i + 1) * 2 + 1]]
            )
        );
    } */

    const res = [];
    /* for (let i = 0; i < midPoints.length; i += 2) {
        res.push(
            <Circle
                key={"mid-" + i}
                name={"line-drag-handle"}
                x={midPoints[i]}
                y={midPoints[i + 1]}
                scale={{ x: 1 / scale, y: 1 / scale }}
                radius={5}
                fill="rgb(255, 0, 85)"
                strokeWidth={1}
                draggable
                dragBoundFunc={dragBoundFunc}
                onDragMove={(e) => onDragMove(e, i / 2)}
            />
        );
    } */

    for (let i = 0; i < points.length; i += 2) {
        res.push(
            <Circle
                key={i}
                name={"line-drag-handle"}
                x={points[i] + line.x()}
                y={points[i + 1] + line.y()}
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

/* const pointBetweenPoints = (p1, p2) => {
    return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
}; */
