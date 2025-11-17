import { LuCircle } from "react-icons/lu";
import { ACTIONS } from "../../store/actions";
import { toWorld } from "../utils/coords";
import Konva from "konva";
import { nanoid } from "nanoid";
import { useShapeStore } from "../../store/shape-store";
import { snapPointToGrid } from "./utils";

export function createDrawEllipseTool({ layerRef, getGrid, addNode }) {
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
            const stage = e.currentTarget;
            if (!stage) return;
            const ptr = stage.getPointerPosition();
            if (!ptr) return;
            const { gridSize, snapToGrid } = getGrid();
            const worldPos = toWorld(stage, ptr);
            const p = snapPointToGrid(worldPos, gridSize, snapToGrid);

            start = p;

            const shapeState = useShapeStore.getState();
            draft = new Konva.Ellipse({
                x: p.x,
                y: p.y,
                radiusX: 0,
                radiusY: 0,
                fill: shapeState.fillColor,
                stroke: shapeState.strokeColor,
                strokeWidth: shapeState.strokeWidth,
                listening: false,
                shadowForStrokeEnabled: false,
                fillAfterStrokeEnabled: true,
            });
            layer = layer = layerRef.current;
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

            let left = Math.min(start.x, cur.x);
            let top = Math.min(start.y, cur.y);
            let w = Math.abs(start.x - cur.x);
            let h = Math.abs(start.y - cur.y);

            if (alt) {
                const dx = Math.abs(start.x - cur.x);
                const dy = Math.abs(start.y - cur.y);
                w = dx * 2;
                h = dy * 2;
                left = start.x - w / 2;
                top = start.y - h / 2;
            }

            // FIXME Немного криво, когда нажаты shift+alt
            if (shift) {
                const size = Math.max(w, h);
                w = size;
                h = size;
                if (!alt) {
                    left = start.x <= cur.x ? start.x : start.x - w;
                    top = start.y <= cur.y ? start.y : start.y - h;
                }
            }

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

        onPointerUp(e) {
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
            const shapeState = useShapeStore.getState();
            addNode(id, {
                type: "ellipse",
                id,
                name: "node",
                x: attrs.x,
                y: attrs.y,
                radiusX: attrs.radiusX,
                radiusY: attrs.radiusY,
                fill: shapeState.fillColor,
                stroke: shapeState.strokeColor,
                strokeWidth: shapeState.strokeWidth,
                fillAfterStrokeEnabled: true,
            });
        },

        cancel() {
            draft?.destroy();
            draft = null;
            layer?.batchDraw?.();
        },
    };
}
