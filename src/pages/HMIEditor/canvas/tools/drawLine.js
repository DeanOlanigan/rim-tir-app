import { LuSlash } from "react-icons/lu";
import Konva from "konva";
import { nanoid } from "nanoid";
import { BASE_PARAMS, snapPointToGrid } from "./utils";
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

            draft = new Konva.Line({
                ...BASE_PARAMS,
                points: [p.x, p.y, p.x, p.y],
                strokeWidth: 1,
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
            addNode(id, {
                id,
                type: "line",
                name: "node",
                ...BASE_PARAMS,
                x: x1,
                y: y1,
                points: [0, 0, dx, dy],
                strokeWidth: 1,
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
