import { registerShape } from "./registry";

registerShape("line", {
    onTransformEnd(konvaNode, ctx) {
        const a = konvaNode.attrs;
        return {
            points: a.points.slice(),
        };
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
