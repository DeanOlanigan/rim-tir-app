import { useCallback } from "react";
import { FIT_PADDING } from "../constants";
import { round4 } from "../utils/coords";
import { useActionsStore } from "../../store/actions-store";

export function useFitToFrame(
    ref,
    frame,
    viewportW,
    viewportH,
    minZoom,
    maxZoom
) {
    return useCallback(() => {
        const setScale = useActionsStore.getState().setScale;
        const stage = ref.current;
        if (!stage) return;
        const scale = round4(
            Math.max(
                minZoom,
                Math.min(
                    maxZoom,
                    Math.min(
                        (viewportW / frame.width) * FIT_PADDING,
                        (viewportH / frame.height) * FIT_PADDING
                    )
                )
            )
        );
        setScale(scale);
        stage.scale({ x: scale, y: scale });
        const x = (viewportW - frame.width * scale) / 2 - frame.x * scale;
        const y = (viewportH - frame.height * scale) / 2 - frame.y * scale;
        stage.position({ x: x || 0, y: y || 0 });
    }, [ref, frame, viewportW, viewportH, minZoom, maxZoom]);
}
