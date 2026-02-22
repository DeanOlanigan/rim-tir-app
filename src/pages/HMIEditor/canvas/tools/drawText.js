import { LuType } from "react-icons/lu";
import Konva from "konva";
import { BASE_PARAMS, computeDragBox, getSnappedWorldPointer } from "./utils";
import { ACTIONS, SHAPES } from "../../constants";

export function createDrawTextTool() {
    let draft = null;
    let start = { x: 0, y: 0 };
    let layer = null;
    const minSize = 4;

    return {
        name: ACTIONS.text,
        label: "Text",
        icon: LuType,
        cursor: "crosshair",
        oneShot: true,

        onPointerDown(e, ctx) {
            if (e.evt.button !== 0) return;
            const stage = e.currentTarget;
            if (!stage) return;

            const p = getSnappedWorldPointer(stage, ctx);
            if (!p) return;

            start = p;

            const text = new Konva.Text({
                ...BASE_PARAMS,
                x: p.x,
                y: p.y,
                width: 0,
                height: 0,
                listening: false,
                text: "Default Text",
            });

            const rect = new Konva.Rect({
                ...BASE_PARAMS,
                x: p.x,
                y: p.y,
                width: 0,
                height: 0,
                listening: false,
                fill: "transparent",
                stroke: "rgb(0, 161, 255)",
                strokeWidth: 1,
                strokeScaleEnabled: false,
            });

            draft = new Konva.Group({ listening: false });
            draft.add(text);
            draft.add(rect);

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

            const rect = draft.findOne("Rect");
            const text = draft.findOne("Text");
            if (!rect || !text) return;

            rect.setAttrs({
                x: box.left,
                y: box.top,
                width: box.width,
                height: box.height,
            });
            text.setAttrs({
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
            if (!box) return;

            draft.destroy();
            draft = null;
            layer.batchDraw();

            if (!box) return;

            ctx.addNode({
                type: SHAPES.text,
                name: "Text",
                x: box.left,
                y: box.top,
                width: box.width,
                height: box.height,
                fontSize: 12,
                text: "Default Text",
                lineHeight: 1,
                letterSpacing: 0,
                align: "left",
                verticalAlign: "top",
                wrap: "word",
                ellipsis: false,
                padding: 0,
                textDecoration: "",
                fontStyle: "normal",
            });
        },

        cancel() {
            draft?.destroy();
            draft = null;
            layer?.batchDraw?.();
        },
    };
}
