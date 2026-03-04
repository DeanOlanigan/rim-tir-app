import { SHAPES } from "../../constants";
import { applyLinePatch } from "./apply";
import { registerShape } from "./registry";

// [ ] Если для линии не использовать стандартный трансформер konva, то этот код не нужен
registerShape(SHAPES.line, {
    onTransformEnd(konvaNode) {
        return applyLinePatch(konvaNode);
    },

    onTransform(konvaNode) {
        return applyLinePatch(konvaNode);
    },
});
