import { LuSquare } from "react-icons/lu";
import { ACTIONS } from "../../store/actions";
import { snap } from "../utils/geom";
import { toWorld } from "../utils/coords";
import Konva from "konva";
import { nanoid } from "nanoid";

export function createDrawRectTool({
    getGrid,
    getWorkSize,
    addNode,
    setSelectedIds,
}) {
    let draft = null;
    let start = { x: 0, y: 0 };

    // prettier-ignore
    const snapP = (p, gridSize, snapToGrid) => snapToGrid ? {
        x: snap(p.x, gridSize, 0),
        y: snap(p.y, gridSize, 0),
    } : p;

    const clampRectInFrame = (r, workW, workH) => {
        const x = Math.max(0, Math.min(r.x, workW - r.width));
        const y = Math.max(0, Math.min(r.y, workH - r.height));
        return { ...r, x, y };
    };

    return {
        name: ACTIONS.square,
        label: "Draw Rectangle",
        icon: LuSquare,
        cursor: "crosshair",

        onPointerDown(e) {
            const stage = e.currentTarget;
            const { gridSize, snapToGrid } = getGrid();
            if (!stage || e.target !== stage) return;
            const p = snapP(
                toWorld(stage, stage.getPointerPosition()),
                gridSize,
                snapToGrid
            );
            start = p;
            draft = new Konva.Rect({
                x: p.x,
                y: p.y,
                width: 0,
                height: 0,
                fill: "#fff",
                stroke: "black",
                strokeWidth: 2,
                listening: false,
                shadowForStrokeEnabled: false,
                fillAfterStrokeEnabled: true,
                cornerRadius: 2,
            });
            const layer = stage.findOne("#DraftLayer");
            if (!layer) {
                console.warn("DraftLayer not found");
                return;
            }
            layer.add(draft);
            layer.batchDraw();
        },

        onPointerMove(e) {
            const stage = e.currentTarget;
            if (!stage || !draft) return;
            const { workW, workH } = getWorkSize();
            const { gridSize, snapToGrid } = getGrid();
            const cur = snapP(
                toWorld(stage, stage.getPointerPosition()),
                gridSize,
                snapToGrid
            );

            let x = Math.min(start.x, cur.x);
            let y = Math.min(start.y, cur.y);
            let w = Math.abs(cur.x - start.x);
            let h = Math.abs(cur.y - start.y);

            if (e.evt.shiftKey) {
                const s = Math.max(w, h);
                x = cur.x < start.x ? start.x - s : start.x;
                y = cur.y < start.y ? start.y - s : start.y;
                w = s;
                h = s;
            }

            const clamped = clampRectInFrame(
                { x, y, width: w, height: h },
                workW,
                workH
            );
            draft.setAttrs(clamped);
            draft.getLayer().batchDraw();
        },

        onPointerUp(e) {
            const stage = e.currentTarget;
            if (!stage || !draft) return;
            const rect = draft.getAttrs();
            draft.destroy();
            draft = null;
            if (rect.width < 1 || rect.height < 1) return;

            const id = nanoid(12);
            addNode(id, {
                type: "rect",
                id,
                name: "node",
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                fill: "#fff",
                stroke: "black",
                strokeWidth: 2,
                fillAfterStrokeEnabled: true,
                cornerRadius: 2,
            });
            //setSelectedIds([id]);
        },

        cancel() {
            draft?.destroy();
            draft = null;
        },
    };
}
