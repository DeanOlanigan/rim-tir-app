import { Transformer } from "react-konva";
import { ROTATION_SNAP_TOLERANCE, ROTATION_SNAPS } from "../constants";
import { toAbs, toWorld } from "./utils/coords";
import { snap } from "./utils/geom";
import { useCallback } from "react";

export const HMITransformer = ({
    transformerRef,
    canvasRef,
    workW,
    workH,
    gridSize,
    snapToGrid,
}) => {
    const anchorBound = useCallback(
        function (_oldPos, newPos) {
            const stage = canvasRef.current;
            const step = snapToGrid ? gridSize : 1;
            const w = toWorld(stage, newPos);
            const nx = snap(w.x, step, 0);
            const ny = snap(w.y, step, 0);
            const cx = Math.min(Math.max(nx, 0), workW);
            const cy = Math.min(Math.max(ny, 0), workH);
            const abs = toAbs(stage, { x: cx, y: cy });
            return abs;
        },
        [canvasRef, workW, workH, gridSize, snapToGrid]
    );

    return (
        <Transformer
            ref={transformerRef}
            keepRatio={false}
            rotationSnaps={ROTATION_SNAPS}
            rotationSnapTolerance={ROTATION_SNAP_TOLERANCE}
            anchorDragBoundFunc={anchorBound}
        />
    );
};
