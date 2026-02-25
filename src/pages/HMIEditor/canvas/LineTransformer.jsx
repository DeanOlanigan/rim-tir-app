import { useActionsStore } from "../store/actions-store";
import { patchStoreRaf, useNodeStore } from "../store/node-store";
import { Circle } from "react-konva";
import { dragBound } from "./utils/dragBound";
import { isLineLikeType } from "../utils";

// TODO Выполнить рефактор

function dragBoundFunc(pos) {
    const { gridSize, snapToGrid } = useActionsStore.getState();
    const stage = this.getStage();
    return dragBound(pos, stage, gridSize, snapToGrid);
}

function lineLocalToOverlay(line, overlayLayer, x, y) {
    // line-local -> stage(abs)
    const abs = line.getAbsoluteTransform().point({ x, y });

    // stage(abs) -> overlay-local
    const invOverlay = overlayLayer.getAbsoluteTransform().copy().invert();
    return invOverlay.point(abs);
}

function overlayAbsToLineLocal(line, absPos) {
    // stage(abs) -> line-local
    const invLine = line.getAbsoluteTransform().copy().invert();
    return invLine.point(absPos);
}

function overlayAbsToLineParent(line, absPos) {
    // stage(abs) -> parent(line)-local (чтобы записать line.x/y в стор)
    const parent = line.getParent();
    const invParent = parent.getAbsoluteTransform().copy().invert();
    return invParent.point(absPos);
}

function parentVecToLineLocal(line, vecParent) {
    // Важно: используем line.getTransform() (line->parent), а не absolute,
    // потому что vecParent уже в parent координатах.
    const inv = line.getTransform().copy();
    inv.invert();

    // чтобы “убить” translation, берём разницу двух преобразований
    const a = inv.point({ x: vecParent.x, y: vecParent.y });
    const b = inv.point({ x: 0, y: 0 });
    return { x: a.x - b.x, y: a.y - b.y };
}

function dragStartHandle(line, absCirclePos, newPoints) {
    const parentPos = overlayAbsToLineParent(line, absCirclePos);

    const dxParent = parentPos.x - line.x();
    const dyParent = parentPos.y - line.y();

    const localDelta = parentVecToLineLocal(line, {
        x: dxParent,
        y: dyParent,
    });

    for (let i = 2; i < newPoints.length; i += 2) {
        newPoints[i] = newPoints[i] - localDelta.x;
        newPoints[i + 1] = newPoints[i + 1] - localDelta.y;
    }
    newPoints[0] = 0;
    newPoints[1] = 0;

    return {
        x: parentPos.x,
        y: parentPos.y,
        points: newPoints,
    };
}

function dragOtherHandle(line, absCirclePos, newPoints, pointIndex) {
    const local = overlayAbsToLineLocal(line, absCirclePos);
    newPoints[pointIndex * 2] = local.x;
    newPoints[pointIndex * 2 + 1] = local.y;

    return {
        x: line.x(),
        y: line.y(),
        points: newPoints,
    };
}

export const LineTransformer = ({ nodesRef, overviewRef }) => {
    const scale = useActionsStore((state) => state.scale);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const primaryNode = useNodeStore((state) => state.nodes[selectedIds[0]]);

    const overlayLayer = overviewRef?.current;
    if (!overlayLayer) return null;

    if (selectedIds.length !== 1) return null;
    if (!primaryNode || !isLineLikeType(primaryNode.type)) return null;

    const line = nodesRef.current.get(primaryNode.id);
    if (!line) return null;

    const points = primaryNode.points;
    if (!points || points.length < 4) return null;

    const onDragStart = () => {
        useNodeStore
            .getState()
            .beginInteractiveSnapshot(
                [primaryNode.id],
                ["points", "width", "height"],
            );
    };

    const onDragMove = (e) => {
        const circle = e.target;
        const pointIndex = circle.getAttr("insertIndex");
        const absCirclePos = circle.getAbsolutePosition();

        const oldPoints = line.points();
        if (!oldPoints || oldPoints.length < 4) return;

        const newPoints = oldPoints.slice();

        let res;
        if (pointIndex === 0) {
            res = dragStartHandle(line, absCirclePos, newPoints);
        } else {
            res = dragOtherHandle(line, absCirclePos, newPoints, pointIndex);
        }

        const x = res.x;
        const y = res.y;

        line.x(x);
        line.y(y);
        line.points(res.points);

        patchStoreRaf({
            [primaryNode.id]: {
                x,
                y,
                points: res.points,
                width: line.width(),
                height: line.height(),
            },
        });
    };

    const onDragEnd = () => {
        patchStoreRaf.flushNow?.();
        useNodeStore
            .getState()
            .commitInteractiveSnapshot(["points", "width", "height"]);
    };

    const onMidDragStart = (e) => {
        const circle = e.target;
        const oldPoints = line.points();
        if (!oldPoints || oldPoints.length < 4) return;

        circle.setAttr("originalPoints", oldPoints.slice());
        useNodeStore
            .getState()
            .beginInteractiveSnapshot(
                [primaryNode.id],
                ["points", "width", "height"],
            );
    };

    const onMidDragMove = (e) => {
        const circle = e.target;

        const originalPoints = circle.getAttr("originalPoints");
        const insertIndex = circle.getAttr("insertIndex");
        if (!originalPoints || typeof insertIndex !== "number") return;

        const absCirclePos = circle.getAbsolutePosition();
        const local = overlayAbsToLineLocal(line, absCirclePos);

        const newPoints = originalPoints.slice();
        newPoints.splice(insertIndex * 2, 0, local.x, local.y);

        line.points(newPoints);
    };

    const onMidDragEnd = () => {
        patchStoreRaf({
            [primaryNode.id]: {
                points: line.points(),
                width: line.width(),
                height: line.height(),
            },
        });
        onDragEnd();
    };

    const deletePoint = (pointIndex) => {
        const oldPoints = line.points();
        if (!oldPoints || oldPoints.length < 4) return;

        const pointsCount = oldPoints.length / 2;
        if (pointsCount <= 2) return; // нельзя удалить, останется меньше 2х точек
        if (pointIndex === 0 || pointIndex === pointsCount - 1) return; // нельзя удалить первую и последнюю точки

        const newPoints = oldPoints.slice();
        newPoints.splice(pointIndex * 2, 2);

        line.points(newPoints);
        useNodeStore.getState().updateNode(primaryNode.id, {
            x: line.x(),
            y: line.y(),
            points: newPoints,
        });
    };

    const onPointDouble = (e) => {
        e.cancelBubble = true;
        const circle = e.target;
        const pointIndex = circle.getAttr("insertIndex");
        deletePoint(pointIndex);
    };

    const midPoints = [];
    const numPoints = points.length / 2;
    for (let i = 0; i < numPoints - 1; i++) {
        const x1 = points[i * 2];
        const y1 = points[i * 2 + 1];
        const x2 = points[(i + 1) * 2];
        const y2 = points[(i + 1) * 2 + 1];
        midPoints.push((x1 + x2) / 2, (y1 + y2) / 2);
    }

    const res = [];
    for (let i = 0; i < midPoints.length; i += 2) {
        const segmentIndex = i / 2;
        const p = lineLocalToOverlay(
            line,
            overlayLayer,
            midPoints[i],
            midPoints[i + 1],
        );
        res.push(
            <Circle
                key={"mid-" + segmentIndex}
                name={"line-midpoint-handle"}
                insertIndex={segmentIndex + 1}
                x={p.x}
                y={p.y}
                scale={{ x: 1 / scale, y: 1 / scale }}
                radius={5}
                fill="rgb(255, 0, 85)"
                strokeWidth={1}
                draggable
                dragBoundFunc={dragBoundFunc}
                onDragStart={onMidDragStart}
                onDragMove={onMidDragMove}
                onDragEnd={onMidDragEnd}
            />,
        );
    }

    for (let i = 0; i < points.length; i += 2) {
        const pointIndex = i / 2;
        const p = lineLocalToOverlay(
            line,
            overlayLayer,
            points[i],
            points[i + 1],
        );
        res.push(
            <Circle
                key={pointIndex}
                name={"line-drag-handle"}
                insertIndex={pointIndex}
                x={p.x}
                y={p.y}
                scale={{ x: 1 / scale, y: 1 / scale }}
                radius={5}
                fill="white"
                stroke={"rgb(0, 161, 255)"}
                strokeWidth={1}
                draggable
                dragBoundFunc={dragBoundFunc}
                onDragStart={onDragStart}
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
                onDblClick={onPointDouble}
            />,
        );
    }

    return res;
};
