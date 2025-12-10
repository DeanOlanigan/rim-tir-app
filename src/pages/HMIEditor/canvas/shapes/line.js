import { SHAPES } from "../../constants";
import { round4 } from "../../utils";
import { registerShape } from "./registry";

registerShape(SHAPES.line, {
    onTransformEnd(konvaNode) {
        const newPoints = [];
        for (let i = 0; i < konvaNode.points().length; i += 2) {
            newPoints[i] = round4(konvaNode.points()[i] * konvaNode.scaleX());
            newPoints[i + 1] = round4(
                konvaNode.points()[i + 1] * konvaNode.scaleY(),
            );
        }
        const patch = {
            x: round4(konvaNode.x()),
            y: round4(konvaNode.y()),
            rotation: round4(konvaNode.rotation()),
            points: newPoints,
        };
        konvaNode.scaleX(1);
        konvaNode.scaleY(1);
        return patch;
    },

    // TODO
    onDragEnd() {},

    onTransform(konvaNode) {
        const newPoints = [];
        for (let i = 0; i < konvaNode.points().length; i += 2) {
            newPoints[i] = round4(konvaNode.points()[i] * konvaNode.scaleX());
            newPoints[i + 1] = round4(
                konvaNode.points()[i + 1] * konvaNode.scaleY(),
            );
        }
        konvaNode.scaleX(1);
        konvaNode.scaleY(1);
        konvaNode.x(round4(konvaNode.x()));
        konvaNode.y(round4(konvaNode.y()));
        konvaNode.rotation(round4(konvaNode.rotation()));
        konvaNode.points(newPoints);
    },

    toModelFromKonva(konvaNode) {
        const a = konvaNode.attrs;
        return {
            type: SHAPES.line,
            id: a.id,
            x: Math.round(a.x),
            y: Math.round(a.y),
            points: a.points.slice(),
            fill: a.fill,
            stroke: a.stroke,
            strokeWidth: a.strokeWidth,
            lineCap: a.lineCap,
            lineJoin: a.lineJoin,
        };
    },
});
