import { SHAPES } from "../../constants";
import { applyRectPatch } from "./apply";
import { registerShape } from "./registry";

registerShape(SHAPES.rect, {
    onTransformEnd(konvaNode) {
        return applyRectPatch(konvaNode);
    },

    onTransform(konvaNode) {
        return applyRectPatch(konvaNode);
    },
});
