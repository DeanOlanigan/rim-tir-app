import { useCallback, useLayoutEffect } from "react";
import { fitToFrame as fitToFrameService } from "../utils/zoomService";

function getWorkAreaSize(nodesRef) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    nodesRef.current.forEach((node) => {
        minX = Math.min(minX, node.x());
        minY = Math.min(minY, node.y());
        maxX = Math.max(maxX, node.x() + node.width());
        maxY = Math.max(maxY, node.y() + node.height());
    });
    return {
        width: maxX - minX,
        height: maxY - minY,
    };
}

export function useFitToFrame(
    canvasRef,
    viewportW,
    viewportH,
    auto = true,
    nodesRef,
) {
    const fitToFrame = useCallback(() => {
        const stage = canvasRef.current;
        if (!stage || !viewportW || !viewportH) return;
        const workAreaSize = getWorkAreaSize(nodesRef);
        fitToFrameService(
            stage,
            workAreaSize.width,
            workAreaSize.height,
            viewportW,
            viewportH,
        );
    }, [canvasRef, viewportW, viewportH, nodesRef]);

    useLayoutEffect(() => {
        if (!auto) return;
        fitToFrame();
    }, [auto, fitToFrame]);

    return fitToFrame;
}
