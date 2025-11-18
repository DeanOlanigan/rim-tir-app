import { LuSquare } from "react-icons/lu";
import { ACTIONS } from "../../store/actions";
import { toWorld } from "../utils/coords";
import Konva from "konva";
import { nanoid } from "nanoid";
import { useShapeStore } from "../../store/shape-store";
import { snapPointToGrid } from "./utils";

export function createDrawRectTool({
    layerRef,
    getGrid,
    getWorkSize,
    addNode,
    setSelectedIds,
}) {
    let draft = null;
    let start = { x: 0, y: 0 };
    let layer = null;
    const minSize = 4;

    /* const clampRectInFrame = (r, workW, workH) => {
        const x = Math.max(0, Math.min(r.x, workW - r.width));
        const y = Math.max(0, Math.min(r.y, workH - r.height));
        return { ...r, x, y };
    }; */

    return {
        name: ACTIONS.square,
        label: "Draw Rectangle",
        icon: LuSquare,
        cursor: "crosshair",

        onPointerDown(e) {
            const stage = e.currentTarget;
            if (!stage) return;
            const ptr = stage.getPointerPosition();
            if (!ptr) return;
            const { gridSize, snapToGrid } = getGrid();
            const worldPos = toWorld(stage, ptr);
            const p = snapPointToGrid(worldPos, gridSize, snapToGrid);
            console.log(p);

            start = p;

            const shapeState = useShapeStore.getState();
            draft = new Konva.Rect({
                x: p.x,
                y: p.y,
                width: 0,
                height: 0,
                fill: shapeState.fillColor,
                stroke: shapeState.strokeColor,
                strokeWidth: shapeState.strokeWidth,
                cornerRadius: shapeState.cornerRadius,
                listening: false,
                shadowForStrokeEnabled: false,
                fillAfterStrokeEnabled: true,
            });
            layer = layerRef.current;
            layer.add(draft);
            layer.batchDraw();
        },

        onPointerMove(e) {
            const stage = e.currentTarget;
            if (!stage || !draft || !layer) return;
            const ptr = stage.getPointerPosition();
            if (!ptr) return;
            //const { workW, workH } = getWorkSize();
            const { gridSize, snapToGrid } = getGrid();
            const curWord = toWorld(stage, ptr);
            const cur = snapPointToGrid(curWord, gridSize, snapToGrid);

            const alt = !!(e.evt && e.evt.altKey);
            const shift = !!(e.evt && e.evt.shiftKey);

            let x = Math.min(start.x, cur.x);
            let y = Math.min(start.y, cur.y);
            let w = Math.abs(start.x - cur.x);
            let h = Math.abs(start.y - cur.y);

            if (alt) {
                const dx = Math.abs(start.x - cur.x);
                const dy = Math.abs(start.y - cur.y);
                w = dx * 2;
                h = dy * 2;
                x = start.x - w / 2;
                y = start.y - h / 2;
            }

            if (shift) {
                const size = Math.max(w, h);
                w = size;
                h = size;
                if (!alt) {
                    x = cur.x < start.x ? start.x - size : start.x;
                    y = cur.y < start.y ? start.y - size : start.y;
                } else {
                    x = start.x - w / 2;
                    y = start.y - h / 2;
                }
            }

            if (w === 0 || h === 0) return;

            /* const clamped = clampRectInFrame(
                { x, y, width: w, height: h },
                workW,
                workH
            ); */

            draft.setAttrs({ x, y, width: w, height: h });
            draft.getLayer().batchDraw();
        },

        onPointerUp(e) {
            const stage = e.currentTarget;
            if (!stage || !draft || !layer) return;

            const attrs = draft.getAttrs();
            draft.destroy();
            draft = null;
            layer.batchDraw();

            if (attrs.width < minSize || attrs.height < minSize) return;

            const id = nanoid(12);
            const shapeState = useShapeStore.getState();
            addNode(id, {
                type: "rect",
                id,
                name: "node",
                x: attrs.x,
                y: attrs.y,
                width: attrs.width,
                height: attrs.height,
                fill: shapeState.fillColor,
                stroke: shapeState.strokeColor,
                strokeWidth: shapeState.strokeWidth,
                cornerRadius: shapeState.cornerRadius,
                fillAfterStrokeEnabled: true,
            });
            //setSelectedIds([id]);
        },

        cancel() {
            draft?.destroy();
            draft = null;
            layer?.batchDraw?.();
        },
    };
}
