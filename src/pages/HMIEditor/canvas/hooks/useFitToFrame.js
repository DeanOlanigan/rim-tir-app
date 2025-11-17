import { useCallback, useLayoutEffect } from "react";
import { fitToFrame as fitToFrameService } from "../utils/zoomService";
import { useActionsStore } from "../../store/actions-store";

export function useFitToFrame(canvasRef, viewportW, viewportH, auto = true) {
    const size = useActionsStore((state) => state.size);
    const fitToFrame = useCallback(() => {
        const stage = canvasRef.current;
        if (!stage || !viewportW || !viewportH) return;
        fitToFrameService(stage, size.width, size.height, viewportW, viewportH);
    }, [canvasRef, size, viewportW, viewportH]);

    useLayoutEffect(() => {
        if (!auto) return;
        fitToFrame();
    }, [auto, fitToFrame]);

    return fitToFrame;
}
