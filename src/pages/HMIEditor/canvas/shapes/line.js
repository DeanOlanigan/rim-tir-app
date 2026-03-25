import { SHAPES } from "../../constants";
import { applyLinePatch } from "./apply";
import { registerShape } from "./registry";

registerShape(SHAPES.line, {
    onTransformEnd(konvaNode) {
        return applyLinePatch(konvaNode);
    },

    onTransform(konvaNode) {
        return applyLinePatch(konvaNode);
    },
});
