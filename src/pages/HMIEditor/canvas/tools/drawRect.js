import { LuSquare } from "react-icons/lu";
import Konva from "konva";
import { nanoid } from "nanoid";
import { BASE_PARAMS, snapPointToGrid } from "./utils";
import { ACTIONS, SHAPES } from "../../constants";
import { toWorld } from "../utils/coords";

export function createDrawRectTool({
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
        name: ACTIONS.square,
        label: "Draw Rectangle",
        icon: LuSquare,
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

            draft = new Konva.Rect({
                ...BASE_PARAMS,
                x: p.x,
                y: p.y,
                width: 0,
                height: 0,
                cornerRadius: 0,
                listening: false,
            });
            layer = getOverviewLayer();
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

            draft.setAttrs({ x, y, width: w, height: h });
            layer.batchDraw();
        },

        onPointerUp(e, api) {
            const stage = e.currentTarget;
            if (!stage || !draft || !layer) return;

            const attrs = draft.getAttrs();
            draft.destroy();
            draft = null;
            layer.batchDraw();

            if (attrs.width < minSize || attrs.height < minSize) return;

            const id = nanoid(12);
            addNode(id, {
                ...BASE_PARAMS,
                type: SHAPES.rect,
                id,
                name: "node",
                x: attrs.x,
                y: attrs.y,
                width: attrs.width,
                height: attrs.height,
                cornerRadius: 0,
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
