import { useCallback, useRef } from "react";
import { clamp } from "../utils/geom";
import { SCROLL_STRENGTH } from "../constants";
import { useActionsStore } from "../../store/actions-store";
import { round4 } from "../utils/coords";
import { ACTIONS } from "../../store/actions";

const zoomAt = (stage, pointer, nextScale) => {
    const oldScale = stage.scaleX();
    const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };
    stage.scale({ x: nextScale, y: nextScale });
    const newPos = {
        x: pointer.x - mousePointTo.x * nextScale,
        y: pointer.y - mousePointTo.y * nextScale,
    };
    stage.position(newPos);
};

export function usePanZoom(ref, minZoom, maxZoom) {
    const setScale = useActionsStore.getState().setScale;
    const setCurrentAction = useActionsStore.getState().setCurrentAction;
    const spacePressed = useRef(false);
    const panning = useRef(false);
    const panStart = useRef(null);

    const onWheel = useCallback(
        (e) => {
            e.evt.preventDefault();
            const stage = e.currentTarget;
            if (!stage) return;

            const pointer = stage.getPointerPosition();
            const oldScale = stage.scaleX();
            const direction = e.evt.deltaY > 0 ? -1 : 1;

            if (e.evt.ctrlKey) {
                const zoomFactor = 1 + direction * 0.1;
                const next = round4(
                    clamp(oldScale * zoomFactor, minZoom, maxZoom)
                );
                setScale(next);
                zoomAt(stage, pointer, next);
            } else if (e.evt.shiftKey) {
                stage.position({
                    x: stage.x() + direction * SCROLL_STRENGTH,
                    y: stage.y(),
                });
            } else {
                stage.position({
                    x: stage.x(),
                    y: stage.y() + direction * SCROLL_STRENGTH,
                });
            }

            console.log({
                x: stage.x(),
                y: stage.y(),
            });
            stage.batchDraw();
        },
        [minZoom, maxZoom, setScale]
    );

    const onKeyDown = useCallback(
        (e) => {
            if (e.code === "Space" && !spacePressed.current) {
                setCurrentAction(ACTIONS.hand);
                spacePressed.current = true;
                const stage = ref.current;
                if (stage) stage.container().style.cursor = "grab";
                e.preventDefault();
            }
        },
        [ref, setCurrentAction]
    );

    const onKeyUp = useCallback(
        (e) => {
            if (e.code === "Space") {
                setCurrentAction(ACTIONS.select);
                spacePressed.current = false;
                const stage = ref.current;
                if (stage && !spacePressed.current)
                    stage.container().style.cursor = "default";
                e.preventDefault();
            }
        },
        [ref, setCurrentAction]
    );

    const onMouseDown = useCallback(
        (e) => {
            const stage = ref.current;
            if (!stage) return;
            if (spacePressed.current || e.evt.button === 1) {
                setCurrentAction(ACTIONS.hand);
                const pointer = stage.getPointerPosition();
                panStart.current = {
                    stageX: stage.x(),
                    stageY: stage.y(),
                    pointerX: pointer.x,
                    pointerY: pointer.y,
                };
                panning.current = true;
                stage.container().style.cursor = "grabbing";
            }
        },
        [ref, setCurrentAction]
    );

    const onMouseMove = useCallback(() => {
        const stage = ref.current;
        if (!stage || !panning.current) return;
        const pointer = stage.getPointerPosition();
        const dx = pointer.x - panStart.current.pointerX;
        const dy = pointer.y - panStart.current.pointerY;
        stage.position({
            x: panStart.current.stageX + dx,
            y: panStart.current.stageY + dy,
        });
        stage.batchDraw();
    }, [ref]);

    const onMouseUp = useCallback(() => {
        const stage = ref.current;
        if (!stage) return;
        panning.current = false;
        stage.container().style.cursor = spacePressed.current
            ? "grab"
            : "default";
        if (!spacePressed.current) setCurrentAction(ACTIONS.select);
    }, [ref, setCurrentAction]);

    return { onWheel, onKeyDown, onKeyUp, onMouseDown, onMouseMove, onMouseUp };
}
