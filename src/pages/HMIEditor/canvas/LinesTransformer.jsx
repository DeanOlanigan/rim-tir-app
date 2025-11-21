import { memo, useCallback, useEffect, useState } from "react";
import { Circle } from "react-konva";

const LinesTransformer = ({ nodeId, canvasRef }) => {
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

    const handleDragPoint = useCallback(
        (indexPair, e) => {
            const stage = canvasRef.current;
            if (!stage) return;
            const absPos = { x: e.target.x(), y: e.target.y() };

            const node = stage.findOne(`#${nodeId}`);
            if (!node) return;
            const pts = node.points ? node.points().slice() : [];
            if (pts.length < 4) {
                while (pts.length < 4) pts.push(0);
            }

            pts[indexPair[0]] = absPos.x;
            pts[indexPair[1]] = absPos.y;

            // update visual node immediately
            node.points(pts);
            // update local state for handles
            setPoints(pts);

            // persist via store (передаём патч — адаптируйте под вашу структуру)
            //updateNode(nodeId, { points: pts });
        },
        [canvasRef, nodeId]
    );

    // вычисляем позиции ручек в абсолютных coords (они уже хранятся в points как абсолютные)
    const p0x = points[0] ?? 0;
    const p0y = points[1] ?? 0;
    const p1x = points[points.length - 2] ?? 0;
    const p1y = points[points.length - 1] ?? 0;

    // радиус/стиль ручек — можно менять
    const r = 7;

    const scale = canvasRef.current.scaleX();
    return (
        <>
            <Circle
                x={p0x}
                y={p0y}
                radius={r}
                draggable
                onDragMove={(e) => handleDragPoint([0, 1], e)}
                listening={true}
                id={`line-handle-${nodeId}-start`}
                fill={"white"}
                stroke={"rgb(0, 161, 255)"}
                strokeWidth={1}
                scale={{ x: 1 / scale, y: 1 / scale }}
                onMouseOver={(e) => {
                    e.target.getStage().container().style.cursor = "move";
                }}
                onMouseOut={(e) => {
                    e.target.getStage().container().style.cursor = "";
                }}
            />
            <Circle
                scale={{ x: 1 / scale, y: 1 / scale }}
                x={p1x}
                y={p1y}
                radius={r}
                draggable
                onDragMove={(e) =>
                    handleDragPoint([points.length - 2, points.length - 1], e)
                }
                listening={true}
                id={`line-handle-${nodeId}-end`}
                fill={"white"}
                stroke={"rgb(0, 161, 255)"}
                strokeWidth={1}
                onMouseOver={(e) => {
                    e.target.getStage().container().style.cursor = "move";
                }}
                onMouseOut={(e) => {
                    e.target.getStage().container().style.cursor = "";
                }}
            />
        </>
    );
};

export default memo(LinesTransformer);
