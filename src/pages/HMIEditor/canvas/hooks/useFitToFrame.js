import { useCallback } from "react";
import { round4 } from "../utils/coords";
import { useActionsStore } from "../../store/actions-store";
import { FIT_PADDING } from "../../constants";

export function useFitToFrame(
    ref,
    workW,
    workH,
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
                        (viewportW / workW) * FIT_PADDING,
                        (viewportH / workH) * FIT_PADDING
                    )
                )
            )
        );
        setScale(scale);
        stage.scale({ x: scale, y: scale });
        const x = (viewportW - workW * scale) / 2;
        const y = (viewportH - workH * scale) / 2;
        stage.position({ x: x || 0, y: y || 0 });
    }, [ref, workW, workH, viewportW, viewportH, minZoom, maxZoom]);
}
