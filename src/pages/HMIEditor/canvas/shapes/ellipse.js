import { SHAPES } from "../../constants";
import { applyEllipsePatch } from "./apply";
import { registerShape } from "./registry";

registerShape(SHAPES.ellipse, {
    onTransformEnd(konvaNode) {
        return applyEllipsePatch(konvaNode);
    },

    onTransform(konvaNode) {
        return applyEllipsePatch(konvaNode);
    },
});
