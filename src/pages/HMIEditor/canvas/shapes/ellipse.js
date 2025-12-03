import { SHAPES } from "../../constants";
import { registerShape } from "./registry";

registerShape(SHAPES.ellipse, {
    onTransformEnd(konvaNode) {
        const radiusX = konvaNode.radiusX() * konvaNode.scaleX();
        const radiusY = konvaNode.radiusY() * konvaNode.scaleY();

        konvaNode.scaleX(1);
        konvaNode.scaleY(1);

        const patch = {
            radiusX: radiusX,
            radiusY: radiusY,
        };

        return patch;
    },

    onTransform(konvaNode) {
        const radiusX = konvaNode.radiusX() * konvaNode.scaleX();
        const radiusY = konvaNode.radiusY() * konvaNode.scaleY();
        konvaNode.scaleX(1);
        konvaNode.scaleY(1);
        konvaNode.radiusX(radiusX);
        konvaNode.radiusY(radiusY);
    },

    toModelFromKonva(konvaNode) {
        const a = konvaNode.attrs;
        return {
            type: SHAPES.ellipse,
            id: a.id,
            x: Math.round(a.x),
            y: Math.round(a.y),
            radiusX: a.radiusX,
            radiusY: a.radiusY,
            fill: a.fill,
            stroke: a.stroke,
            strokeWidth: a.strokeWidth,
            fillAfterStrokeEnabled: a.fillAfterStrokeEnabled,
        };
    },
});
