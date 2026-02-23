import { SHAPES } from "../../constants";
import { applyEllipsePatch } from "./apply";
import { registerShape } from "./registry";

registerShape(SHAPES.polygon, {
    onTransformEnd(konvaNode) {
        return applyEllipsePatch(konvaNode);
    },

    onTransform(konvaNode) {
        return applyEllipsePatch(konvaNode);
    },
});
