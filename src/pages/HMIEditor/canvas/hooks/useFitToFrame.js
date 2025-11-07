import { useCallback } from "react";
import { FIT_PADDING } from "../constants";
import { round4 } from "../utils/coords";

export function useFitToFrame(
    ref,
    frame,
    viewportW,
    viewportH,
    minZoom,
    maxZoom
) {
    return useCallback(() => {
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
        stage.scale({ x: scale, y: scale });
        const x = (viewportW - frame.width * scale) / 2 - frame.x * scale;
        const y = (viewportH - frame.height * scale) / 2 - frame.y * scale;
        stage.position({ x: x || 0, y: y || 0 });
        stage.batchDraw();
    }, [ref, frame, viewportW, viewportH, minZoom, maxZoom]);
}
