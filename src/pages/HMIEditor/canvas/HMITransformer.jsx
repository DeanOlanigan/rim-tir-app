import { Transformer } from "react-konva";
import { ROTATION_SNAP_TOLERANCE, ROTATION_SNAPS } from "../constants";
import { toAbs, toWorld } from "./utils/coords";
import { snap } from "./utils/geom";
import { useCallback } from "react";
import { useNodeStore } from "../store/node-store";
import { updateStoreNode } from "./utils/store";

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

    const transformEndHandler = (e) => {
        const node = e.target;
        updateStoreNode(node, useNodeStore.getState().updateNode);
    };

    const transformHandler = (e) => {
        const node = e.target;
        node.width(node.width() * node.scaleX());
        node.height(node.height() * node.scaleY());
        node.scaleX(1);
        node.scaleY(1);
    };

    return (
        <Transformer
            ref={transformerRef}
            keepRatio={false}
            rotationSnaps={ROTATION_SNAPS}
            rotationSnapTolerance={ROTATION_SNAP_TOLERANCE}
            ignoreStroke={true}
            anchorDragBoundFunc={anchorBound}
            onTransformEnd={transformEndHandler}
            onTransform={transformHandler}
        />
    );
};
