import { LuSquare } from "react-icons/lu";
import { ACTIONS } from "../../store/actions";
import { snap } from "../utils/geom";
import { toWorld } from "../utils/coords";
import Konva from "konva";
import { nanoid } from "nanoid";

export function createDrawRectTool({ depsRef }) {
    let draft = null;
    let start = { x: 0, y: 0 };

    // prettier-ignore
    const snapP = (p, gridSize, frame, snapToGrid) => snapToGrid ? {
        x: snap(p.x, gridSize, frame.x),
        y: snap(p.y, gridSize, frame.y),
    } : p;

    const clampRectInFrame = (r, frame) => {
        const x = Math.max(
            frame.x,
            Math.min(r.x, frame.x + frame.width - r.width)
        );
        const y = Math.max(
            frame.y,
            Math.min(r.y, frame.y + frame.height - r.height)
        );
        return { ...r, x, y };
    };

    return {
        name: ACTIONS.square,
        label: "Draw Rectangle",
        icon: LuSquare,
        cursor: "crosshair",

        onPointerDown(e) {
            const stage = e.currentTarget;
            const { gridSize, frame, snapToGrid } = depsRef.current;
            if (!stage || e.target !== stage) return;
            const p = snapP(
                toWorld(stage, stage.getPointerPosition()),
                gridSize,
                frame,
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
            const { gridSize, frame, snapToGrid } = depsRef.current;
            if (!stage || !draft) return;
            const cur = snapP(
                toWorld(stage, stage.getPointerPosition()),
                gridSize,
                frame,
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
                frame
            );
            draft.setAttrs(clamped);
            draft.getLayer().batchDraw();
        },

        onPointerUp(e) {
            const stage = e.currentTarget;
            const { addNode } = depsRef.current;
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
        },

        cancel() {
            draft?.destroy();
            draft = null;
        },
    };
}
