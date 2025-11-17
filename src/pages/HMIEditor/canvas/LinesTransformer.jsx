import { memo, useCallback, useEffect, useState } from "react";
import { useNodeStore } from "../store/node-store";
import { toAbs, toWorld } from "./utils/coords";
import { snap } from "./utils/geom";
import { Circle } from "react-konva";

const LinesTransformer = ({ nodeId, canvasRef, gridSize, snapToGrid }) => {
    const updateNode = useNodeStore.getState().updateNode;
    const [points, setPoints] = useState([0, 0, 0, 0]);

    useEffect(() => {
        const stage = canvasRef.current;
        if (!stage) return;
        const node = stage.findOne(`#${nodeId}`);
        if (!node) return;
        const pts = node.points ? node.points().slice() : [];
        // если короткая линия — гарантируем минимум 4 числа
        if (pts.length < 4) {
            while (pts.length < 4) pts.push(0);
        }
        setPoints(pts);
    }, [canvasRef, nodeId]);

    const toSnappedAbs = useCallback(
        (stage, pos) => {
            const step = snapToGrid ? gridSize : 1;
            const w = toWorld(stage, pos);
            const nx = snap(w.x, step, 0);
            const ny = snap(w.y, step, 0);
            return toAbs(stage, { x: nx, y: ny });
        },
        [gridSize, snapToGrid]
    );

    const handleDragPoint = useCallback(
        (indexPair, e) => {
            const stage = canvasRef.current;
            if (!stage) return;
            // pos in absolute coords relative to stage
            const absPos = { x: e.target.x(), y: e.target.y() };
            // snap to grid in world coords then convert back to absolute for storing and rendering
            const snappedAbs = toSnappedAbs(stage, absPos);

            // read current points from stage node (so concurrent updates survive)
            const node = stage.findOne(`#${nodeId}`);
            if (!node) return;
            const pts = node.points ? node.points().slice() : [];
            if (pts.length < 4) {
                while (pts.length < 4) pts.push(0);
            }

            pts[indexPair[0]] = snappedAbs.x;
            pts[indexPair[1]] = snappedAbs.y;

            // update visual node immediately
            node.points(pts);
            // update local state for handles
            setPoints(pts);

            // persist via store (передаём патч — адаптируйте под вашу структуру)
            updateNode(nodeId, { points: pts });
        },
        [canvasRef, nodeId, toSnappedAbs, updateNode]
    );

    // вычисляем позиции ручек в абсолютных coords (они уже хранятся в points как абсолютные)
    const p0x = points[0] ?? 0;
    const p0y = points[1] ?? 0;
    const p1x = points[points.length - 2] ?? 0;
    const p1y = points[points.length - 1] ?? 0;

    // радиус/стиль ручек — можно менять
    const r = 2;

    console.log({
        p0x,
        p0y,
        p1x,
        p1y,
    });

    return (
        <>
            <Circle
                x={p0x}
                y={p0y}
                radius={r}
                draggable
                onDragMove={(e) => handleDragPoint([0, 1], e)}
                onDragEnd={(e) => handleDragPoint([0, 1], e)}
                listening={true}
                id={`line-handle-${nodeId}-start`}
                fill={"red"}
            />
            <Circle
                x={p1x}
                y={p1y}
                radius={r}
                draggable
                onDragMove={(e) =>
                    handleDragPoint([points.length - 2, points.length - 1], e)
                }
                onDragEnd={(e) =>
                    handleDragPoint([points.length - 2, points.length - 1], e)
                }
                listening={true}
                id={`line-handle-${nodeId}-end`}
                fill={"red"}
            />
        </>
    );
};

export default memo(LinesTransformer);
