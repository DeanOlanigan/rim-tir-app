import { SHAPES } from "../../constants";
import { applyLinePatch } from "./apply";
import { registerShape } from "./registry";
import Konva from "konva";

// Editor semantic patch:
// ignore arrow head in self bounds to match Figma/Excalidraw-like selection semantics
Konva.Arrow.prototype.getSelfRect = function () {
    return Konva.Line.prototype.getSelfRect.call(this);
};

registerShape(SHAPES.arrow, {
    onTransformEnd(konvaNode) {
        const pointerLength = konvaNode.pointerLength();
        const pointerWidth = konvaNode.pointerWidth();
        const patch = applyLinePatch(konvaNode);
        patch.pointerLength = pointerLength;
        patch.pointerWidth = pointerWidth;
        konvaNode.pointerLength(pointerLength);
        konvaNode.pointerWidth(pointerWidth);
        return patch;
    },

    onTransform(konvaNode) {
        const pointerLength = konvaNode.pointerLength();
        const pointerWidth = konvaNode.pointerWidth();
        const patch = applyLinePatch(konvaNode);
        patch.pointerLength = pointerLength;
        patch.pointerWidth = pointerWidth;
        konvaNode.pointerLength(pointerLength);
        konvaNode.pointerWidth(pointerWidth);
        return patch;
    },
});
