import { LuHand } from "react-icons/lu";
import { ACTIONS } from "../../store/actions";
import { useActionsStore } from "../../store/actions-store";

export function createHandTool({ stageRef }) {
    const setCurrentAction = useActionsStore.getState().setCurrentAction;
    let space = false;
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
            /* if (space || e.evt.button === 1) {
                setCurrentAction(ACTIONS.hand);
            } */
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
        },

        onPointerUp(e) {
            const stage = e.currentTarget;
            if (!stage || !panning) return;
            panning = false;
            stage.container().style.cursor = "grab";
            /* stage.container().style.cursor = space
                ? manager.getActive()?.cursor
                : "default";
            if (!space) manager.popTemp(); */
        },

        onKeyDown(e) {
            if (e.code === "Space" && !space) {
                space = true;
                //manager.pushTemp("hand");
                const stage = stageRef.current;
                if (stage) stage.container().style.cursor = "grab";
                e.preventDefault();
            }
        },

        onKeyUp(e) {
            if (e.code === "Space") {
                space = false;
                /* const stage = stageRef.current;
                if (stage)
                    stage.container().style.cursor =
                        manager.getActive()?.cursor || "default";
                manager.popTemp(); */
                e.preventDefault();
            }
        },

        cancel() {
            /* const stage = stageRef.current;
            if (stage)
                stage.container().style.cursor =
                    manager.getActive()?.cursor || "default"; */
            panning = false;
            space = false;
            panStart = null;
        },
    };
}
