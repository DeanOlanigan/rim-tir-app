import { registerShape } from "./registry";

registerShape("rect", {
    onTransformEnd(konvaNode, ctx) {
        const width = konvaNode.width() * konvaNode.scaleX();
        const height = konvaNode.height() * konvaNode.scaleY();

        konvaNode.scaleX(1);
        konvaNode.scaleY(1);

        const patch = {
            x: Math.round(konvaNode.x()),
            y: Math.round(konvaNode.y()),
            width: Math.round(width),
            height: Math.round(height),
        };

        return patch;
    },

    toModelFromKonva(konvaNode) {
        const a = konvaNode.attrs;
        return {
            type: "rect",
            id: a.id,
            x: Math.round(a.x),
            y: Math.round(a.y),
            width: Math.round(a.width),
            height: Math.round(a.height),
            fill: a.fill,
            stroke: a.stroke,
            strokeWidth: a.strokeWidth,
            fillAfterStrokeEnabled: a.fillAfterStrokeEnabled,
            cornerRadius: a.cornerRadius,
        };
    },
});
