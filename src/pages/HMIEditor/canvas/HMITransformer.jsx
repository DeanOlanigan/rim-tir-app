import { Transformer } from "react-konva";
import { ROTATION_SNAP_TOLERANCE, ROTATION_SNAPS } from "../constants";
import { toAbs, toWorld } from "./utils/coords";
import { snap } from "./utils/geom";
import { memo, useCallback, useEffect } from "react";
import { useNodeStore } from "../store/node-store";
import { getShape } from "./shapes";
import { useActionsStore } from "../store/actions-store";

const HMITransformer = ({ nodesRef, transformerRef, canvasRef }) => {
    console.log("Render HMITRansformer", nodesRef);
    //const size = useActionsStore((state) => state.size);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const gridSize = useActionsStore((state) => state.gridSize);
    const snapToGrid = useActionsStore((state) => state.snap);
    const primaryNode = useNodeStore((state) => state.nodes[selectedIds[0]]);

    const isLineLike =
        primaryNode &&
        (primaryNode.type === "line" || primaryNode.type === "arrow");
    const resizeEnabled = !isLineLike;
    const enabledAnchors = resizeEnabled ? undefined : [];
    console.log({ isLineLike, resizeEnabled });

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
        [canvasRef, gridSize, snapToGrid]
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
            flipEnabled={false}
            resizeEnabled={resizeEnabled}
            enabledAnchors={enabledAnchors}
            anchorDragBoundFunc={resizeEnabled ? anchorBound : undefined}
            onTransformEnd={resizeEnabled ? transformEndHandler : undefined}
            onTransform={resizeEnabled ? transformHandler : undefined}
        />
    );
};

export default memo(HMITransformer);
