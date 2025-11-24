import { Rect, Transformer } from "react-konva";
import { ROTATION_SNAP_TOLERANCE, ROTATION_SNAPS } from "../constants";
import { toAbs, toWorld } from "./utils/coords";
import { snap } from "./utils/geom";
import { memo, useCallback, useEffect } from "react";
import { useNodeStore } from "../store/node-store";
import { getShape } from "./shapes";
import { useActionsStore } from "../store/actions-store";

const HMITransformer = ({ nodesRef, transformerRef, canvasRef }) => {
    console.log("Render HMITRansformer", nodesRef);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const primaryNode = useNodeStore((state) => state.nodes[selectedIds[0]]);

    const isLineLike =
        primaryNode &&
        selectedIds.length === 1 &&
        (primaryNode.type === "line" || primaryNode.type === "arrow");

    useEffect(() => {
        const transformer = transformerRef.current;
        if (!transformer) return;

        if (selectedIds.length > 0) {
            const instances = selectedIds
                .map((id) => nodesRef.current.get(id))
                .filter(Boolean);
            transformer.nodes(instances);
        } else {
            transformer.nodes([]);
        }
    }, [selectedIds, nodesRef, transformerRef]);

    const anchorBound = useCallback(
        function (_oldPos, newPos) {
            const { gridSize, snapToGrid } = useActionsStore.getState();
            const stage = canvasRef.current;
            const step = snapToGrid ? gridSize : 1;
            const w = toWorld(stage, newPos);
            const nx = snap(w.x, step, 0);
            const ny = snap(w.y, step, 0);
            //const cx = Math.min(Math.max(nx, 0), workW);
            //const cy = Math.min(Math.max(ny, 0), workH);
            const abs = toAbs(stage, { x: nx, y: ny });
            return abs;
        },
        [canvasRef]
    );

    const transformEndHandler = (e) => {
        const node = e.target;
        const { id, type } = node.attrs;
        const shape = getShape(type);

        const { gridSize, snapToGrid } = useActionsStore.getState();
        const ctx = { gridSize, snapToGrid };
        let patch = {};

        if (shape && typeof shape.onTransformEnd === "function") {
            patch = shape.onTransformEnd(node, ctx);
        }
        useNodeStore.getState().updateNode(id, patch);
    };

    const transformHandler = (e) => {
        const node = e.target;
        const type = node.attrs.type;
        const shape = getShape(type);
        const { gridSize, snapToGrid } = useActionsStore.getState();
        const ctx = { gridSize, snapToGrid };
        if (shape && typeof shape.onTransform === "function") {
            shape.onTransform(node, ctx);
        }
    };

    if (isLineLike) return null;

    return (
        <>
            <Transformer
                ref={transformerRef}
                keepRatio={false}
                rotationSnaps={ROTATION_SNAPS}
                rotationSnapTolerance={ROTATION_SNAP_TOLERANCE}
                ignoreStroke={true}
                flipEnabled={false}
                borderDash={selectedIds.length > 1 ? [4, 4] : undefined}
                anchorDragBoundFunc={anchorBound}
                onTransformEnd={transformEndHandler}
                onTransform={transformHandler}
            />
            {selectedIds.length > 1 &&
                selectedIds.map((id) => {
                    const node = nodesRef.current.get(id);
                    if (!node) return null;
                    const bb = node.getClientRect({
                        relativeTo: canvasRef.current,
                        skipStroke: true,
                        skipShadow: true,
                    });
                    return (
                        <Rect
                            key={id}
                            x={bb.x}
                            y={bb.y}
                            width={bb.width}
                            height={bb.height}
                            stroke="rgb(0, 100, 255)"
                            strokeWidth={2}
                            strokeScaleEnabled={false}
                            listening={false}
                        />
                    );
                })}
        </>
    );
};
export default memo(HMITransformer);
