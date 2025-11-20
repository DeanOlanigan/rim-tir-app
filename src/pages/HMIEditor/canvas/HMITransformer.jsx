import { Transformer } from "react-konva";
import { ACTIONS, ROTATION_SNAP_TOLERANCE, ROTATION_SNAPS } from "../constants";
import { toAbs, toWorld } from "./utils/coords";
import { snap } from "./utils/geom";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useNodeStore } from "../store/node-store";
import { getShape } from "./shapes";
import { useActionsStore } from "../store/actions-store";
import LinesTransformer from "./LinesTransformer";

const LINE_TYPES = new Set([ACTIONS.line, ACTIONS.arrow]);

const HMITransformer = ({ transformerRef, canvasRef }) => {
    console.log("Render HMITRansformer");
    //const size = useActionsStore((state) => state.size);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const gridSize = useActionsStore((state) => state.gridSize);
    const snapToGrid = useActionsStore((state) => state.snap);

    const singleSelectedId = selectedIds.length === 1 ? selectedIds[0] : null;
    const selectedNodeType = useMemo(() => {
        const stage = canvasRef.current;
        if (!stage || !singleSelectedId) return null;
        const node = stage.findOne(`#${singleSelectedId}`);
        return node ? node.attrs?.type : null;
    }, [canvasRef, singleSelectedId]);

    useEffect(() => {
        const stage = canvasRef.current;
        const transformer = transformerRef.current;
        if (!stage || !transformer) return;
        const set = new Set(selectedIds);

        if (selectedIds.length === 1 && LINE_TYPES.has(selectedNodeType)) {
            transformer.nodes([]);
            return;
        }
        const nodes = stage.find(".node").filter((n) => set.has(n.id()));
        transformer.nodes(nodes);
    }, [selectedIds, selectedNodeType, canvasRef, transformerRef]);

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

    return singleSelectedId && LINE_TYPES.has(selectedNodeType) ? (
        <LinesTransformer
            canvasRef={canvasRef}
            nodeId={singleSelectedId}
            gridSize={gridSize}
            snapToGrid={snapToGrid}
        />
    ) : (
        <Transformer
            ref={transformerRef}
            keepRatio={false}
            rotationSnaps={ROTATION_SNAPS}
            rotationSnapTolerance={ROTATION_SNAP_TOLERANCE}
            ignoreStroke={true}
            anchorDragBoundFunc={anchorBound}
            onTransformEnd={transformEndHandler}
            onTransform={transformHandler}
            flipEnabled={false}
        />
    );
};

export default memo(HMITransformer);
