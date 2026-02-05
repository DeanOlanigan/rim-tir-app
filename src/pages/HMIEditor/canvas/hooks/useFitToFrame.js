import { useCallback, useLayoutEffect } from "react";
import { fitToFrame as fitToFrameService } from "../utils/zoomService";

function getWorkAreaSize(nodesRef) {
    const nodes = nodesRef?.current;
    if (!nodes || nodes.size === 0) return null;

    let hasAny = false;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach((node) => {
        if (!node) return;
        hasAny = true;

        const rect = node.getClientRect({
            skipShadow: true,
            skipStroke: true,
            relativeTo: node.getStage(),
        });
        minX = Math.min(minX, rect.x);
        minY = Math.min(minY, rect.y);
        maxX = Math.max(maxX, rect.x + rect.width);
        maxY = Math.max(maxY, rect.y + rect.height);
    });

    if (!hasAny) return null;

    const width = maxX - minX;
    const height = maxY - minY;

    if (!Number.isFinite(width) || !Number.isFinite(height)) return null;

    return {
        x: minX,
        y: minY,
        width: Math.max(width, 1),
        height: Math.max(height, 1),
    };
}

export function useFitToFrame({ canvasRef, auto = true, nodesRef }) {
    const fitToFrame = useCallback(() => {
        const stage = canvasRef.current;
        if (!stage) return;
        const workArea = getWorkAreaSize(nodesRef);

        if (!workArea) {
            stage.scale({ x: 1, y: 1 });
            stage.position({ x: stage.width() / 2, y: stage.height() / 2 });
            return;
        }

        fitToFrameService(stage, workArea, stage.width(), stage.height());
    }, [canvasRef, nodesRef]);

    useLayoutEffect(() => {
        if (!auto) return;
        fitToFrame();
    }, [auto, fitToFrame]);

    return fitToFrame;
}
