import { LuSquare } from "react-icons/lu";
import Konva from "konva";
import { BASE_PARAMS, computeDragBox, getSnappedWorldPointer } from "./utils";
import { ACTIONS, SHAPES } from "../../constants";

export function createDrawRectTool() {
    let draft = null;
    let start = { x: 0, y: 0 };
    let layer = null;
    const minSize = 4;

    return {
        name: ACTIONS.square,
        label: "Draw Rectangle",
        icon: LuSquare,
        cursor: "crosshair",

        onPointerDown(e, ctx) {
            if (e.evt.button !== 0) return;

            const stage = e.currentTarget;
            if (!stage) return;

            const p = getSnappedWorldPointer(stage, ctx);
            if (!p) return;

            start = p;
            draft = new Konva.Rect({
                ...BASE_PARAMS,
                x: p.x,
                y: p.y,
                width: 0,
                height: 0,
                cornerRadius: 0,
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
                x: box.left,
                y: box.top,
                width: box.width,
                height: box.height,
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
                ...BASE_PARAMS,
                type: SHAPES.rect,
                name: "Rectangle",
                x: box.left,
                y: box.top,
                width: box.width,
                height: box.height,
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
