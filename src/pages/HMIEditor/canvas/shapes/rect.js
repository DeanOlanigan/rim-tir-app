import { SHAPES } from "../../constants";
import { round4 } from "../../utils";
import { registerShape } from "./registry";

registerShape(SHAPES.rect, {
    onTransformEnd(konvaNode) {
        const width = konvaNode.width() * konvaNode.scaleX();
        const height = konvaNode.height() * konvaNode.scaleY();

        konvaNode.scaleX(1);
        konvaNode.scaleY(1);

        const patch = {
            x: round4(konvaNode.x()),
            y: round4(konvaNode.y()),
            width: Math.round(width),
            height: Math.round(height),
            rotation: round4(konvaNode.rotation()),
        };

        return patch;
    },

    onGroupMod(konvaNode, scaleX, scaleY) {
        const width = konvaNode.width() * scaleX;
        const height = konvaNode.height() * scaleY;
        konvaNode.width(round4(width));
        konvaNode.height(round4(height));
        konvaNode.rotation(round4(konvaNode.rotation()));
        konvaNode.x(round4(konvaNode.x()));
        konvaNode.y(round4(konvaNode.y()));
    },

    onTransform(konvaNode) {
        const width = konvaNode.width() * konvaNode.scaleX();
        const height = konvaNode.height() * konvaNode.scaleY();
        konvaNode.scaleX(1);
        konvaNode.scaleY(1);
        konvaNode.position({
            x: round4(konvaNode.x()),
            y: round4(konvaNode.y()),
        });
        konvaNode.rotation(round4(konvaNode.rotation()));
        konvaNode.width(round4(width));
        konvaNode.height(round4(height));
    },

    toModelFromKonva(konvaNode) {
        const a = konvaNode.attrs;
        return {
            type: SHAPES.rect,
            id: a.id,
            x: round4(a.x),
            y: round4(a.y),
            width: Math.round(a.width),
            height: Math.round(a.height),
            rotation: round4(a.rotation),
            fill: a.fill,
            stroke: a.stroke,
            strokeWidth: a.strokeWidth,
            fillAfterStrokeEnabled: a.fillAfterStrokeEnabled,
            cornerRadius: a.cornerRadius,
        };
    },
});
