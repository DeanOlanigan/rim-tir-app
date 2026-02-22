import { useCallback, useLayoutEffect } from "react";
import { fitToFrame as fitToFrameService } from "../utils/zoomService";
import { getWorkAreaSize } from "../../utils";

export function useFitToFrame({ canvasRef, auto = true, nodesRef }) {
    const fitToFrame = useCallback(() => {
        const stage = canvasRef.current;
        if (!stage) return;
        const workArea = getWorkAreaSize({ nodesRef });

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
