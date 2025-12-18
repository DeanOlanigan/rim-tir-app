import { SHAPES } from "../../constants";
import { round4 } from "../../utils";
import { registerShape } from "./registry";

registerShape(SHAPES.ellipse, {
    onTransformEnd(konvaNode) {
        const rx = Math.abs(konvaNode.radiusX() * konvaNode.scaleX());
        const ry = Math.abs(konvaNode.radiusY() * konvaNode.scaleY());

        const patch = {
            x: round4(konvaNode.x() - rx),
            y: round4(konvaNode.y() - ry),
            width: round4(rx * 2),
            height: round4(ry * 2),
            rotation: round4(konvaNode.rotation()),
            scaleX: 1,
            scaleY: 1,
            skewX: round4(konvaNode.skewX()),
            skewY: round4(konvaNode.skewY()),
        };

        // нормализация: после фиксации — сбрасываем scale и записываем радиусы
        konvaNode.scaleX(1);
        konvaNode.scaleY(1);
        konvaNode.radiusX(rx);
        konvaNode.radiusY(ry);
        konvaNode.skewX(patch.skewX);
        konvaNode.skewY(patch.skewY);

        return patch;
    },

    onTransform(konvaNode) {
        const rx = Math.abs(konvaNode.radiusX() * konvaNode.scaleX());
        const ry = Math.abs(konvaNode.radiusY() * konvaNode.scaleY());

        const patch = {
            x: round4(konvaNode.x() - rx),
            y: round4(konvaNode.y() - ry),
            width: round4(rx * 2),
            height: round4(ry * 2),
            rotation: round4(konvaNode.rotation()),
            scaleX: 1,
            scaleY: 1,
            skewX: round4(konvaNode.skewX()),
            skewY: round4(konvaNode.skewY()),
        };

        // нормализация: после фиксации — сбрасываем scale и записываем радиусы
        konvaNode.scaleX(1);
        konvaNode.scaleY(1);
        konvaNode.radiusX(rx);
        konvaNode.radiusY(ry);
        konvaNode.skewX(patch.skewX);
        konvaNode.skewY(patch.skewY);

        return patch;
    },
});
