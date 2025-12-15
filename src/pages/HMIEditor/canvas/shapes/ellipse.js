import { SHAPES } from "../../constants";
import { round4 } from "../../utils";
import { registerShape } from "./registry";

registerShape(SHAPES.ellipse, {
    onTransformEnd(konvaNode) {
        const rx = Math.abs(konvaNode.radiusX() * konvaNode.scaleX());
        const ry = Math.abs(konvaNode.radiusY() * konvaNode.scaleY());

        const width = rx * 2;
        const height = ry * 2;

        const patch = {
            x: round4(konvaNode.x() - width / 2),
            y: round4(konvaNode.y() - height / 2),
            width: round4(width),
            height: round4(height),
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

        const width = rx * 2;
        const height = ry * 2;

        const patch = {
            x: round4(konvaNode.x() - width / 2),
            y: round4(konvaNode.y() - height / 2),
            width: round4(width),
            height: round4(height),
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
