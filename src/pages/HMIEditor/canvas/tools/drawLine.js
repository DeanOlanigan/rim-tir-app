import { LuSlash } from "react-icons/lu";
import Konva from "konva";
import { nanoid } from "nanoid";
import { useShapeStore } from "../../store/shape-store";
import { snapPointToGrid } from "./utils";
import { ACTIONS } from "../../constants";
import { toWorld } from "../utils/coords";

export function createDrawLineTool({
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
        name: ACTIONS.line,
        label: "Draw line",
        icon: LuSlash,
        cursor: "crosshair",

        onPointerDown(e) {
            if (e.evt.button !== 0) return;
            const stage = e.currentTarget;
            if (!stage) return;
            const prt = stage.getPointerPosition();
            if (!prt) return;
            const { gridSize, snapToGrid } = getGrid();
            const worldPos = toWorld(stage, prt);
            const p = snapPointToGrid(worldPos, gridSize, snapToGrid);

            start = p;

            const shapeState = useShapeStore.getState();
            draft = new Konva.Line({
                points: [p.x, p.y, p.x, p.y],
                stroke: shapeState.strokeColor,
                strokeWidth: shapeState.strokeWidth,
                lineCap: "round",
                lineJoin: "round",
                listening: false,
                shadowForStrokeEnabled: false,
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

            draft.points([start.x, start.y, cur.x, cur.y]);
            layer.batchDraw();
        },

        onPointerUp(e, api) {
            const stage = e.currentTarget;
            if (!stage || !draft || !layer) return;
            const ptr = stage.getPointerPosition();
            if (!ptr) return;
            const { gridSize, snapToGrid } = getGrid();
            const curWord = toWorld(stage, ptr);
            const cur = snapPointToGrid(curWord, gridSize, snapToGrid);

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
                type: "line",
                id,
                name: "node",
                points: [x1, y1, x2, y2],
                stroke: shapeState.strokeColor,
                strokeWidth: shapeState.strokeWidth,
                lineCap: "round",
                lineJoin: "round",
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
