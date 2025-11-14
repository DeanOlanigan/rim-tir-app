import { useCallback, useLayoutEffect } from "react";
import { fitToFrame as fitToFrameService } from "../utils/zoomService";

export function useFitToFrame(
    canvasRef,
    workW,
    workH,
    viewportW,
    viewportH,
    auto = true
) {
    const fitToFrame = useCallback(() => {
        const stage = canvasRef.current;
        if (!stage || !viewportW || !viewportH) return;
        fitToFrameService(stage, workW, workH, viewportW, viewportH);
    }, [canvasRef, workW, workH, viewportW, viewportH]);

    useLayoutEffect(() => {
        if (!auto) return;
        fitToFrame();
    }, [auto, fitToFrame]);

    return fitToFrame;
}
