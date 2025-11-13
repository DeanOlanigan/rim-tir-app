import { LuSlash } from "react-icons/lu";
import { ACTIONS } from "../../store/actions";
import { snap } from "../utils/geom";
import { toWorld } from "../utils/coords";
import Konva from "konva";
import { nanoid } from "nanoid";
import { useShapeStore } from "../../store/shape-store";

export function createDrawLineTool({ getGrid, addNode }) {
    let draft = null;
    let start = { x: 0, y: 0 };

    // prettier-ignore
    const snapP = (p, gridSize, snapToGrid) => snapToGrid ? {
        x: snap(p.x, gridSize, 0),
        y: snap(p.y, gridSize, 0),
    } : p;

    return {
        name: ACTIONS.line,
        label: "Draw line",
        icon: LuSlash,
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
            draft = new Konva.Line({
                points: [p.x, p.y, p.x, p.y],
                stroke: useShapeStore.getState().strokeColor,
                strokeWidth: useShapeStore.getState().strokeWidth,
                lineCap: "round",
                lineJoin: "round",
                listening: false,
                shadowForStrokeEnabled: false,
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
            const { gridSize, snapToGrid } = getGrid();
            const cur = snapP(
                toWorld(stage, stage.getPointerPosition()),
                gridSize,
                snapToGrid
            );

            draft.points([start.x, start.y, cur.x, cur.y]);
            draft.getLayer().batchDraw();
        },

        onPointerUp(e) {
            const stage = e.currentTarget;
            if (!stage || !draft) return;

            const { gridSize, snapToGrid } = getGrid();
            const cur = snapP(
                toWorld(stage, stage.getPointerPosition()),
                gridSize,
                snapToGrid
            );

            // финальные точки
            const x1 = start.x;
            const y1 = start.y;
            const x2 = cur.x;
            const y2 = cur.y;

            // минимальная длина линии (чтоб не создавать "тык" по экрану)
            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);

            draft.destroy();
            draft = null;

            if (distance < 1) return;

            const id = nanoid(12);
            addNode(id, {
                type: "line",
                id,
                name: "node",
                points: [x1, y1, x2, y2],
                stroke: useShapeStore.getState().strokeColor,
                strokeWidth: useShapeStore.getState().strokeWidth,
                lineCap: "round",
                lineJoin: "round",
            });
        },

        cancel() {
            draft?.destroy();
            draft = null;
        },
    };
}
