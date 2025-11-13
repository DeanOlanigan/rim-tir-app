import { LuCircle } from "react-icons/lu";
import { ACTIONS } from "../../store/actions";
import { snap } from "../utils/geom";
import { toWorld } from "../utils/coords";
import Konva from "konva";
import { nanoid } from "nanoid";
import { useShapeStore } from "../../store/shape-store";

export function createDrawEllipseTool({ getGrid, addNode }) {
    let draft = null;
    let start = { x: 0, y: 0 };

    // prettier-ignore
    const snapP = (p, gridSize, snapToGrid) => snapToGrid ? {
        x: snap(p.x, gridSize, 0),
        y: snap(p.y, gridSize, 0),
    } : p;

    return {
        name: ACTIONS.ellipse,
        label: "Draw ellipse",
        icon: LuCircle,
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
            draft = new Konva.Ellipse({
                x: p.x,
                y: p.y,
                width: 0,
                height: 0,
                radiusX: 0,
                radiusY: 0,
                fill: useShapeStore.getState().fillColor,
                stroke: useShapeStore.getState().strokeColor,
                strokeWidth: useShapeStore.getState().strokeWidth,
                listening: false,
                shadowForStrokeEnabled: false,
                fillAfterStrokeEnabled: true,
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

            let x = Math.min(start.x, cur.x);
            let y = Math.min(start.y, cur.y);
            let w = Math.abs(cur.x - start.x);
            let h = Math.abs(cur.y - start.y);
            let rx = w / 2;
            let ry = h / 2;

            console.log({
                x,
                y,
                width: w,
                height: h,
                radiusX: rx,
                radiusY: ry,
            });
            draft.setAttrs({
                x,
                y,
                width: w,
                height: h,
                radiusX: rx,
                radiusY: ry,
            });
            draft.getLayer().batchDraw();
        },

        onPointerUp(e) {
            const stage = e.currentTarget;
            if (!stage || !draft) return;
            const ellipse = draft.getAttrs();
            console.log(ellipse);
            draft.destroy();
            draft = null;
            if (ellipse.width < 1 || ellipse.height < 1) return;

            const id = nanoid(12);
            addNode(id, {
                type: "ellipse",
                id,
                name: "node",
                x: ellipse.x,
                y: ellipse.y,
                radiusX: ellipse.radiusX,
                radiusY: ellipse.radiusY,
                fill: useShapeStore.getState().fillColor,
                stroke: useShapeStore.getState().strokeColor,
                strokeWidth: useShapeStore.getState().strokeWidth,
                fillAfterStrokeEnabled: true,
            });
        },

        cancel() {
            draft?.destroy();
            draft = null;
        },
    };
}
