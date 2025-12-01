import { LuCircle } from "react-icons/lu";
import { toWorld } from "../utils/coords";
import Konva from "konva";
import { nanoid } from "nanoid";
import { BASE_PARAMS, snapPointToGrid } from "./utils";
import { ACTIONS } from "../../constants";

export function createDrawEllipseTool({
    getOverviewLayer,
    getGrid,
    addNode,
    setSelectedIds,
}) {
    let draft = null;
    let start = { x: 0, y: 0 };
    let layer = null;
    const minSize = 4;

    return {
        name: ACTIONS.ellipse,
        label: "Draw ellipse",
        icon: LuCircle,
        cursor: "crosshair",

        onPointerDown(e) {
            if (e.evt.button !== 0) return;
            const stage = e.currentTarget;
            if (!stage) return;
            const ptr = stage.getPointerPosition();
            if (!ptr) return;
            const { gridSize, snapToGrid } = getGrid();
            const worldPos = toWorld(stage, ptr);
            const p = snapPointToGrid(worldPos, gridSize, snapToGrid);

            start = p;

            draft = new Konva.Ellipse({
                ...BASE_PARAMS,
                x: p.x,
                y: p.y,
                radiusX: 0,
                radiusY: 0,
                listening: false,
            });
            layer = layer = getOverviewLayer();
            layer.add(draft);
            layer.batchDraw();
        },

        onPointerMove(e) {
            const stage = e.currentTarget;
            if (!stage || !draft || !layer) return;

            const ptr = stage.getPointerPosition();
            if (!ptr) return;

            const { gridSize, snapToGrid } = getGrid();
            const curWord = toWorld(stage, ptr);
            const cur = snapPointToGrid(curWord, gridSize, snapToGrid);

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
                width: w,
                height: h,
                radiusX: rx,
                radiusY: ry,
            });
            layer.batchDraw();
        },

        onPointerUp(e, api) {
            const stage = e.currentTarget;
            if (!stage || !draft || !layer) return;

            const attrs = draft.getAttrs();
            draft.destroy();
            draft = null;
            layer.batchDraw();

            if (
                (attrs.radiusX || 0) * 2 < minSize ||
                (attrs.radiusY || 0) * 2 < minSize
            )
                return;

            const id = nanoid(12);
            addNode(id, {
                ...BASE_PARAMS,
                type: "ellipse",
                id,
                name: "node",
                x: attrs.x,
                y: attrs.y,
                radiusX: attrs.radiusX,
                radiusY: attrs.radiusY,
            });
            api.manager.setActive("select");
            setSelectedIds([id]);
        },

        cancel() {
            draft?.destroy();
            draft = null;
            layer?.batchDraw?.();
        },
    };
}
