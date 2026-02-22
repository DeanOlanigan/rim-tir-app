import { LuHexagon } from "react-icons/lu";
import { BASE_PARAMS, computeDragBox, getSnappedWorldPointer } from "./utils";
import { ACTIONS, SHAPES } from "../../constants";
import { VariablePolygon } from "../shapes/VariablePolygon";

export function createDrawVariablePolygonTool() {
    let draft = null;
    let start = { x: 0, y: 0 };
    let layer = null;
    const minSize = 4;

    return {
        name: ACTIONS.polygon,
        label: "Draw Variable Polygon",
        icon: LuHexagon,
        cursor: "crosshair",
        oneShot: true,

        onPointerDown(e, ctx) {
            if (e.evt.button !== 0) return;
            const stage = e.currentTarget;
            if (!stage) return;

            const p = getSnappedWorldPointer(stage, ctx);
            if (!p) return;

            start = p;
            draft = new VariablePolygon({
                ...BASE_PARAMS,
                x: p.x,
                y: p.y,
                radiusX: 0,
                radiusY: 0,
                sides: 6,
                listening: false,
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
                name: "Variable Polygon",
                x: box.left,
                y: box.top,
                width: box.width,
                height: box.height,
                sides: 6,
            });
        },

        cancel() {
            draft?.destroy();
            draft = null;
            layer?.batchDraw?.();
        },
    };
}
