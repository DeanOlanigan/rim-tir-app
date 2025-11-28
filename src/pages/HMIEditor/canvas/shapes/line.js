import { registerShape } from "./registry";

registerShape("line", {
    onTransformEnd(konvaNode) {
        const a = konvaNode.attrs;
        return {
            points: a.points.slice(),
        };
    },

    // TODO
    onDragEnd(konvaNode) {},

    onTransform(konvaNode) {
        const newPoints = [];
        for (let i = 0; i < konvaNode.points().length; i += 2) {
            newPoints[i] = konvaNode.points()[i] * konvaNode.scaleX();
            newPoints[i + 1] = konvaNode.points()[i + 1] * konvaNode.scaleY();
        }
        konvaNode.points(newPoints);
        konvaNode.scaleX(1);
        konvaNode.scaleY(1);
    },

    toModelFromKonva(konvaNode) {
        const a = konvaNode.attrs;
        return {
            type: "line",
            id: a.id,
            x: Math.round(a.x),
            y: Math.round(a.y),
            points: a.points.slice(),
            fill: a.fill,
            stroke: a.stroke,
            strokeWidth: a.strokeWidth,
            lineCap: a.lineCap,
            lineJoin: a.lineJoin,
        };
    },
});
