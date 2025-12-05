import { LuHand } from "react-icons/lu";
import { ACTIONS } from "../../constants";

export function createHandTool() {
    let panStart = null;
    let panning = false;

    const beginPan = (stage, pointer) => {
        panStart = {
            stageX: stage.x(),
            stageY: stage.y(),
            pointerX: pointer.x,
            pointerY: pointer.y,
        };
        panning = true;
        stage.container().style.cursor = "grabbing";
    };

    return {
        name: ACTIONS.hand,
        label: "Hand",
        icon: LuHand,
        cursor: "grab",

        onPointerDown(e) {
            if (e.evt.button !== 0 && e.evt.button !== 1) return;
            const stage = e.currentTarget;
            if (!stage) return;
            const pointer = stage.getPointerPosition();
            if (pointer) beginPan(stage, pointer);
        },

        onPointerMove(e) {
            const stage = e.currentTarget;
            if (!stage || !panning) return;
            const pointer = stage.getPointerPosition();
            if (!pointer) return;
            const dx = pointer.x - panStart.pointerX;
            const dy = pointer.y - panStart.pointerY;
            stage.position({
                x: panStart.stageX + dx,
                y: panStart.stageY + dy,
            });
            stage.batchDraw();
        },

        onPointerUp(e) {
            const stage = e.currentTarget;
            if (!stage || !panning) return;
            panning = false;
            stage.container().style.cursor = "grab";
        },

        cancel(ctx) {
            const stage = ctx.getStage();
            if (!stage || !panning) return;
            stage.container().style.cursor = "grab";
            panning = false;
            panStart = null;
        },
    };
}
