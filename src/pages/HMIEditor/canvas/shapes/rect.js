import { SHAPES } from "../../constants";
import { round4 } from "../../utils";
import { registerShape } from "./registry";

registerShape(SHAPES.rect, {
    onTransformEnd(konvaNode) {
        const patch = {
            x: round4(konvaNode.x()),
            y: round4(konvaNode.y()),
            width: round4(konvaNode.width() * konvaNode.scaleX()),
            height: round4(konvaNode.height() * konvaNode.scaleY()),
            rotation: round4(konvaNode.rotation()),
            scaleX: 1,
            scaleY: 1,
            skewX: round4(konvaNode.skewX()),
            skewY: round4(konvaNode.skewY()),
        };
        konvaNode.position({
            x: patch.x,
            y: patch.y,
        });
        konvaNode.width(patch.width);
        konvaNode.height(patch.height);
        konvaNode.rotation(patch.rotation);
        konvaNode.scaleX(1);
        konvaNode.scaleY(1);
        konvaNode.skewX(patch.skewX);
        konvaNode.skewY(patch.skewY);

        return patch;
    },

    onTransform(konvaNode) {
        const patch = {
            x: round4(konvaNode.x()),
            y: round4(konvaNode.y()),
            width: round4(konvaNode.width() * konvaNode.scaleX()),
            height: round4(konvaNode.height() * konvaNode.scaleY()),
            rotation: round4(konvaNode.rotation()),
            scaleX: 1,
            scaleY: 1,
            skewX: round4(konvaNode.skewX()),
            skewY: round4(konvaNode.skewY()),
        };
        konvaNode.position({
            x: patch.x,
            y: patch.y,
        });
        konvaNode.width(patch.width);
        konvaNode.height(patch.height);
        konvaNode.rotation(patch.rotation);
        konvaNode.scaleX(1);
        konvaNode.scaleY(1);
        konvaNode.skewX(patch.skewX);
        konvaNode.skewY(patch.skewY);

        return patch;
    },
});
