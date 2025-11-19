import { useCallback } from "react";
import { SCROLL_STRENGTH } from "../../constants";
import { zoomByPercent } from "../utils/zoomService";

export function usePanZoom() {
    const onWheel = useCallback((e) => {
        e.evt.preventDefault();
        const stage = e.currentTarget;
        if (!stage) return;

        const pointer = stage.getPointerPosition();
        const dir = e.evt.deltaY > 0 ? -1 : 1;

        if (e.evt.ctrlKey) {
            zoomByPercent(stage, dir, pointer);
        } else if (e.evt.shiftKey) {
            stage.position({
                x: stage.x() + dir * SCROLL_STRENGTH,
                y: stage.y(),
            });
        } else {
            stage.position({
                x: stage.x(),
                y: stage.y() + dir * SCROLL_STRENGTH,
            });
        }
        stage.batchDraw();
    }, []);

    return onWheel;
}
