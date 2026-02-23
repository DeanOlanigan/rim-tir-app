import { SHAPES } from "../../constants";
import { applyRectPatch } from "./apply";
import { registerShape } from "./registry";

registerShape(SHAPES.text, {
    onTransformEnd(konvaNode) {
        return applyRectPatch(konvaNode);
    },

    onTransform(konvaNode) {
        return applyRectPatch(konvaNode);
    },
});
