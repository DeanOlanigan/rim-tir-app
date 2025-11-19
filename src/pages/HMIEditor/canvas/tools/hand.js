import { LuHand } from "react-icons/lu";
import { ACTIONS } from "../../store/actions";

export function createHandTool() {
    //let space = false;
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

        /* onKeyDown(e) {
            if (e.code === "Space" && !space) {
                space = true;
                const stage = getStage();
                if (stage) stage.container().style.cursor = "grab";
                e.preventDefault();
            }
        }, */

        onKeyUp(e, api) {
            if (e.code === "Space") {
                api.manager.setActive("select");
                //space = false;
                //e.preventDefault();
            }
        },

        cancel() {
            panning = false;
            //space = false;
            panStart = null;
        },
    };
}
