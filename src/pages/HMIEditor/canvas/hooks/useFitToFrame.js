import { useCallback, useLayoutEffect } from "react";
import { fitToFrame as fitToFrameService } from "../utils/zoomService";

function getWorkAreaSize(nodesRef) {
    const nodes = nodesRef?.current;
    if (!nodes) return null;

    let hasAny = false;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach((node) => {
        if (!node) return;
        hasAny = true;

        const x = node.x();
        const y = node.y();
        const w = node.width();
        const h = node.height();

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + w);
        maxY = Math.max(maxY, y + h);
    });

    if (!hasAny) return null;

    const width = maxX - minX;
    const height = maxY - minY;

    if (!Number.isFinite(width) || !Number.isFinite(height)) return null;

    return {
        width: Math.max(width, 1),
        height: Math.max(height, 1),
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

        if (!workAreaSize) {
            stage.scale({ x: 1, y: 1 });
            stage.position({ x: viewportW / 2, y: viewportH / 2 });
            return;
        }

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
