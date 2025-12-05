import { LuHexagon } from "react-icons/lu";
import { toWorld } from "../utils/coords";
import Konva from "konva";
import { BASE_PARAMS, snapPointToGrid } from "./utils";
import { ACTIONS, SHAPES } from "../../constants";

export function createDrawPolygonTool() {
    let draft = null;
    let start = { x: 0, y: 0 };
    let layer = null;
    const minSize = 4;

    return {
        name: ACTIONS.polygon,
        label: "Draw Polygon",
        icon: LuHexagon,
        cursor: "crosshair",

        onPointerDown(e, ctx) {
            if (e.evt.button !== 0) return;
            const stage = e.currentTarget;
            if (!stage) return;
            const ptr = stage.getPointerPosition();
            if (!ptr) return;
            const { gridSize, snapToGrid } = ctx.getGrid();
            const worldPos = toWorld(stage, ptr);
            const p = snapPointToGrid(worldPos, gridSize, snapToGrid);

            start = p;

            draft = new Konva.RegularPolygon({
                ...BASE_PARAMS,
                x: p.x,
                y: p.y,
                radius: 0,
                sides: 6,
                listening: false,
            });
            layer = ctx.getOverviewLayer();
            layer.add(draft);
            layer.batchDraw();
        },

        onPointerMove(e, ctx) {
            const stage = e.currentTarget;
            if (!stage || !draft || !layer) return;

            const ptr = stage.getPointerPosition();
            if (!ptr) return;

            const { gridSize, snapToGrid } = ctx.getGrid();
            const curWorld = toWorld(stage, ptr);
            const cur = snapPointToGrid(curWorld, gridSize, snapToGrid);

            const alt = !!(e.evt && e.evt.altKey);
            const shift = !!(e.evt && e.evt.shiftKey);

            const dx = cur.x - start.x;
            const dy = cur.y - start.y;

            let left = Math.min(start.x, cur.x);
            let top = Math.min(start.y, cur.y);
            let w = Math.abs(dx);
            let h = Math.abs(dy);

            if (alt) {
                const absDx = Math.abs(dx);
                const absDy = Math.abs(dy);
                w = absDx * 2;
                h = absDy * 2;
                left = start.x - w / 2;
                top = start.y - h / 2;
            }

            if (shift) {
                const size = Math.max(w, h);
                w = size;
                h = size;

                if (!alt) {
                    left = cur.x < start.x ? start.x - w : start.x;
                    top = cur.y < start.y ? start.y - h : start.y;
                } else {
                    left = start.x - w / 2;
                    top = start.y - h / 2;
                }
            }

            if (w < minSize || h < minSize) return;

            const rx = w / 2;
            const ry = h / 2;
            const cx = left + rx;
            const cy = top + ry;

            draft.setAttrs({
                x: cx,
                y: cy,
                radius: rx,
            });
            layer.batchDraw();
        },

        onPointerUp(e, ctx) {
            const stage = e.currentTarget;
            if (!stage || !draft || !layer) return;

            const attrs = draft.getAttrs();
            draft.destroy();
            draft = null;
            layer.batchDraw();

            if ((attrs.radius || 0) * 2 < minSize) return;

            ctx.addNode({
                ...BASE_PARAMS,
                type: SHAPES.polygon,
                name: "Polygon",
                x: attrs.x,
                y: attrs.y,
                radius: attrs.radius,
                sides: attrs.sides,
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
