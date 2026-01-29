import { LuSlash } from "react-icons/lu";
import Konva from "konva";
import { BASE_PARAMS, computeDragLine, getSnappedWorldPointer } from "./utils";
import { ACTIONS, SHAPES } from "../../constants";

export function createDrawLineTool() {
    let draft = null;
    let start = { x: 0, y: 0 };
    let layer = null;
    const minSize = 4;

    return {
        name: ACTIONS.line,
        label: "Draw line",
        icon: LuSlash,
        cursor: "crosshair",

        onPointerDown(e, ctx) {
            if (e.evt.button !== 0) return;
            const stage = e.currentTarget;
            if (!stage) return;

            const p = getSnappedWorldPointer(stage, ctx);
            if (!p) return;

            start = p;
            draft = new Konva.Line({
                ...BASE_PARAMS,
                points: [p.x, p.y, p.x, p.y],
                strokeWidth: 1,
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

            draft.points([start.x, start.y, cur.x, cur.y]);
            layer.batchDraw();
        },

        onPointerUp(e, ctx) {
            const stage = e.currentTarget;
            if (!stage || !draft || !layer) return;

            const cur = getSnappedWorldPointer(stage, ctx);
            if (!cur) {
                draft.destroy();
                draft = null;
                layer.batchDraw();
                return;
            }

            const info = computeDragLine(start, cur, minSize);

            draft.destroy();
            draft = null;
            layer.batchDraw();

            if (!info) return;

            ctx.addNode({
                ...BASE_PARAMS,
                type: SHAPES.line,
                name: "Line",
                x: info.x1,
                y: info.y1,
                points: [0, 0, info.dx, info.dy],
                strokeWidth: 1,
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
