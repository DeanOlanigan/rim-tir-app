import { LuMoveUpRight } from "react-icons/lu";
import { ACTIONS } from "../../store/actions";
import { snap } from "../utils/geom";
import { toWorld } from "../utils/coords";
import Konva from "konva";
import { nanoid } from "nanoid";
import { useShapeStore } from "../../store/shape-store";

export function createDrawArrowTool({ getGrid, addNode }) {
    let draft = null;
    let start = { x: 0, y: 0 };
    let layer = null;
    const minSize = 4;

    const snapP = (p, gridSize, snapToGrid) => {
        const step = snapToGrid ? gridSize : 1;
        return {
            x: snap(p.x, step, 0),
            y: snap(p.y, step, 0),
        };
    };

    return {
        name: ACTIONS.arrow,
        label: "Draw arrow",
        icon: LuMoveUpRight,
        cursor: "crosshair",

        onPointerDown(e) {
            const stage = e.currentTarget;
            if (!stage) return;
            const prt = stage.getPointerPosition();
            if (!prt) return;
            const { gridSize, snapToGrid } = getGrid();
            const worldPos = toWorld(stage, prt);
            const p = snapP(worldPos, gridSize, snapToGrid);

            start = p;

            const shapeState = useShapeStore.getState();
            draft = new Konva.Arrow({
                points: [p.x, p.y, p.x, p.y],
                stroke: shapeState.strokeColor,
                strokeWidth: shapeState.strokeWidth,
                fill: shapeState.fillColor,
                pointerLength: 10,
                pointerWidth: 10,
                lineCap: "round",
                lineJoin: "round",
                listening: false,
                shadowForStrokeEnabled: false,
            });
            layer = stage.findOne("#DraftLayer");
            if (!layer) {
                console.warn("DraftLayer not found");
                draft.destroy();
                draft = null;
                return;
            }
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
            const cur = snapP(curWord, gridSize, snapToGrid);

            draft.points([start.x, start.y, cur.x, cur.y]);
            layer.batchDraw();
        },

        onPointerUp(e) {
            const stage = e.currentTarget;
            if (!stage || !draft || !layer) return;
            const ptr = stage.getPointerPosition();
            if (!ptr) return;
            const { gridSize, snapToGrid } = getGrid();
            const curWord = toWorld(stage, ptr);
            const cur = snapP(curWord, gridSize, snapToGrid);

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
            layer.batchDraw();

            if (distance < minSize) return;

            const id = nanoid(12);
            const shapeState = useShapeStore.getState();
            addNode(id, {
                type: "arrow",
                id,
                name: "node",
                points: [x1, y1, x2, y2],
                fill: shapeState.fillColor,
                stroke: shapeState.strokeColor,
                strokeWidth: shapeState.strokeWidth,
                lineCap: "round",
                lineJoin: "round",
                pointerLength: 10,
                pointerWidth: 10,
            });
        },

        cancel() {
            draft?.destroy();
            draft = null;
            layer?.batchDraw?.();
        },
    };
}
