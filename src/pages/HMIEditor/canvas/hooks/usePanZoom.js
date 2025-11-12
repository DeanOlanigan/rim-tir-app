import { useCallback } from "react";
import { clamp } from "../utils/geom";
import { useActionsStore } from "../../store/actions-store";
import { round4 } from "../utils/coords";
import { SCROLL_STRENGTH } from "../../constants";

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
        },
        [minZoom, maxZoom, setScale]
    );

    return onWheel;
}
