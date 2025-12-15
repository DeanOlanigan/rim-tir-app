import { SHAPES } from "../../constants";
import { round4 } from "../../utils";
import { scaleLinePointsLikeSelfRect } from "../services/shapeTransforms";
import { registerShape } from "./registry";

registerShape(SHAPES.arrow, {
    // TODO взыв при вертикальном трансформе
    onTransformEnd(konvaNode) {
        const sx = konvaNode.scaleX();
        const sy = konvaNode.scaleY();

        const rect = konvaNode.getSelfRect();
        const oldPoints = konvaNode.points();

        const newPoints = scaleLinePointsLikeSelfRect(oldPoints, rect, sx, sy);

        konvaNode.points(newPoints);
        konvaNode.scaleX(1);
        konvaNode.scaleY(1);

        const patch = {
            x: round4(konvaNode.x()),
            y: round4(konvaNode.y()),
            rotation: round4(konvaNode.rotation()),
            points: newPoints,
            width: round4(konvaNode.width()),
            height: round4(konvaNode.height()),
            scaleX: 1,
            scaleY: 1,
            skewX: round4(konvaNode.skewX()),
            skewY: round4(konvaNode.skewY()),
        };
        return patch;
    },

    onTransform(konvaNode) {
        const sx = konvaNode.scaleX();
        const sy = konvaNode.scaleY();

        const rect = konvaNode.getSelfRect();
        const oldPoints = konvaNode.points();

        const newPoints = scaleLinePointsLikeSelfRect(oldPoints, rect, sx, sy);

        konvaNode.points(newPoints);
        konvaNode.scaleX(1);
        konvaNode.scaleY(1);

        const patch = {
            x: round4(konvaNode.x()),
            y: round4(konvaNode.y()),
            rotation: round4(konvaNode.rotation()),
            points: newPoints,
            width: round4(konvaNode.width()),
            height: round4(konvaNode.height()),
            scaleX: 1,
            scaleY: 1,
            skewX: round4(konvaNode.skewX()),
            skewY: round4(konvaNode.skewY()),
        };
        return patch;
    },
});
