import { LuHexagon } from "react-icons/lu";
import {
    BASE_PARAMS,
    buildPolygon,
    computeDragBox,
    getSnappedWorldPointer,
} from "./utils";
import { ACTIONS, SHAPES } from "../../constants";
import Konva from "konva";

export function createDrawPolygonShapeTool() {
    let draft = null;
    let start = { x: 0, y: 0 };
    let layer = null;
    const minSize = 4;
    const sides = 6;

    return {
        name: ACTIONS.polygon,
        label: "Draw Polygon",
        icon: LuHexagon,
        cursor: "crosshair",

        onPointerDown(e, ctx) {
            if (e.evt.button !== 0) return;
            const stage = e.currentTarget;
            if (!stage) return;

            const p = getSnappedWorldPointer(stage, ctx);
            if (!p) return;

            start = p;
            draft = new Konva.Shape({
                ...BASE_PARAMS,
                x: p.x,
                y: p.y,
                radiusX: 0,
                radiusY: 0,
                sides,
                listening: false,
                sceneFunc: function (context, shape) {
                    const rx = shape.attrs.radiusX || 0;
                    const ry = shape.attrs.radiusY || 0;
                    const s = shape.attrs.sides || 6;
                    if (rx === 0 || ry === 0) return;

                    const pts = buildPolygon(rx, ry, s);
                    context.beginPath();
                    context.moveTo(pts[0], pts[1]);
                    for (let i = 2; i < pts.length; i += 2) {
                        context.lineTo(pts[i], pts[i + 1]);
                    }
                    context.closePath();
                    context.fillStrokeShape(shape);
                },
            });

            layer = ctx.getOverviewLayer();
            layer.add(draft);
            layer.batchDraw();
        },

        onPointerMove(e, ctx) {
            if (!draft || !layer) return;
            const stage = e.currentTarget;
            if (!stage) return;

            const cur = getSnappedWorldPointer(stage, ctx);
            if (!cur) return;

            const alt = !!(e.evt && e.evt.altKey);
            const shift = !!(e.evt && e.evt.shiftKey);
            const box = computeDragBox(start, cur, { alt, shift, minSize: 0 });
            if (!box) return;

            draft.setAttrs({
                x: box.centerX,
                y: box.centerY,
                radiusX: box.radiusX,
                radiusY: box.radiusY,
            });
            layer.batchDraw();
        },

        onPointerUp(e, ctx) {
            const stage = e.currentTarget;
            if (!stage || !draft || !layer) return;

            const cur = getSnappedWorldPointer(stage, ctx);
            const alt = !!(e.evt && e.evt.altKey);
            const shift = !!(e.evt && e.evt.shiftKey);

            const box = cur
                ? computeDragBox(start, cur, { alt, shift, minSize })
                : null;

            draft.destroy();
            draft = null;
            layer.batchDraw();

            if (!box) return;

            ctx.addNode({
                type: SHAPES.polygon,
                name: "Polygon",
                x: box.centerX,
                y: box.centerY,
                width: box.width,
                height: box.height,
                sides,
                cornerRadius: 0,
            });
            ctx.manager.setActive(ACTIONS.select);
        },

        cancel() {
            draft?.destroy();
            draft = null;
            layer?.batchDraw?.();
        },
    };
}
