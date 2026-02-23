import { SHAPES } from "../../constants";
import { clampVal, round4 } from "../../utils";
import { registerShape } from "./registry";

// [ ] Если для линии не использовать стандартный трансформер konva, то этот код не нужен
registerShape(SHAPES.line, {
    onTransformEnd(konvaNode) {
        const sx = clampVal(konvaNode.scaleX());
        const sy = clampVal(konvaNode.scaleY());

        const oldPoints = konvaNode.points();
        const newPoints = [];
        for (let i = 0; i < oldPoints.length; i += 2) {
            const px = oldPoints[i];
            const py = oldPoints[i + 1];
            newPoints[i] = px * sx;
            newPoints[i + 1] = py * sy;
        }

        konvaNode.points(newPoints);
        konvaNode.scaleX(1);
        konvaNode.scaleY(1);

        const patch = {
            x: round4(konvaNode.x()),
            y: round4(konvaNode.y()),
            rotation: konvaNode.rotation(),
            points: newPoints,
            width: konvaNode.width(),
            height: konvaNode.height(),
            scaleX: 1,
            scaleY: 1,
            skewX: konvaNode.skewX(),
            skewY: konvaNode.skewY(),
        };
        return patch;
    },

    onTransform(konvaNode) {
        const sx = clampVal(konvaNode.scaleX());
        const sy = clampVal(konvaNode.scaleY());

        const oldPoints = konvaNode.points();
        const newPoints = [];
        for (let i = 0; i < oldPoints.length; i += 2) {
            const px = oldPoints[i];
            const py = oldPoints[i + 1];
            newPoints[i] = px * sx;
            newPoints[i + 1] = py * sy;
        }

        konvaNode.points(newPoints);
        konvaNode.scaleX(1);
        konvaNode.scaleY(1);

        const patch = {
            x: round4(konvaNode.x()),
            y: round4(konvaNode.y()),
            rotation: konvaNode.rotation(),
            points: newPoints,
            width: konvaNode.width(),
            height: konvaNode.height(),
            scaleX: 1,
            scaleY: 1,
            skewX: konvaNode.skewX(),
            skewY: konvaNode.skewY(),
        };
        return patch;
    },
});
