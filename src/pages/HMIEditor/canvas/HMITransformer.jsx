import { Rect, Transformer } from "react-konva";
import { ROTATION_SNAP_TOLERANCE, ROTATION_SNAPS, SHAPES } from "../constants";
import { memo, useCallback, useEffect } from "react";
import { patchStoreRaf, useNodeStore } from "../store/node-store";
import { getShape } from "./shapes";
import { useActionsStore } from "../store/actions-store";
import { dragBound } from "./utils/dragBound";
import { isLineLikeType } from "../utils";

function transformHandler(e) {
    const node = e.target;
    const id = node.attrs.id;
    const type = node.attrs.type;
    const shape = getShape(type);
    let patch = {};
    if (!shape?.onTransform) {
        console.warn("No onTransform handler for shape type:", type);
        return;
    }
    // TODO во всех шейпах обновлять konva
    const res = shape.onTransform(node);
    if (type === SHAPES.group) {
        Object.assign(patch, res);
    } else {
        patch[id] = res;
    }
    patchStoreRaf(Object.keys(patch), patch);
}

function transformEndHandler(nodes) {
    if (nodes.length === 0) return;
    const ids = nodes.map((node) => node.id());
    let patchesById = {};
    for (const node of nodes) {
        const { id, type } = node.attrs;
        const shape = getShape(type);
        if (!shape?.onTransformEnd) {
            console.warn("No shape adapter for type:", type);
            continue;
        }
        const res = shape.onTransformEnd(node);
        if (type === SHAPES.group) {
            Object.assign(patchesById, res);
        } else {
            patchesById[id] = res;
        }
    }
    useNodeStore.getState().updateNodes(ids, patchesById);
}

const HMITransformer = ({ nodesRef, transformerRef, canvasRef }) => {
    const selectedIds = useNodeStore((state) => state.selectedIds);

    useEffect(() => {
        const transformer = transformerRef.current;
        if (!transformer) return;

        if (!selectedIds || selectedIds.length === 0) {
            transformer.nodes([]);
            return;
        }

        const nodes = useNodeStore.getState().nodes;
        if (!nodes) return;

        if (
            selectedIds.length === 1 &&
            isLineLikeType(nodes[selectedIds[0]].type)
        ) {
            transformer.nodes([]);
            return;
        }

        const instances = selectedIds.map((id) => nodesRef.current.get(id));
        transformer.nodes(instances);
    }, [selectedIds, nodesRef, transformerRef]);

    const anchorBound = useCallback(
        function (_oldPos, newPos) {
            const { gridSize, snapToGrid } = useActionsStore.getState();
            const stage = canvasRef.current;
            return dragBound(newPos, stage, gridSize, snapToGrid);
        },
        [canvasRef],
    );

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
                onTransformEnd={() => {
                    const nodes = transformerRef.current.nodes();
                    transformEndHandler(nodes);
                }}
                onTransform={transformHandler}
            />
            {selectedIds.length > 1 &&
                selectedIds.map((id) => (
                    <SelectionRect key={id} id={id} nodesRef={nodesRef} />
                ))}
        </>
    );
};
export default memo(HMITransformer);

const SelectionRect = ({ id, nodesRef }) => {
    // простая подписка только ради триггера
    useNodeStore((state) => {
        const n = state.nodes[id];
        return n
            ? `${n.x}-${n.y}-${n.width}-${n.height}-${n.rotation}-${n.skewX}-${n.skewY}`
            : "";
    });

    const kNode = nodesRef.current.get(id);
    if (!kNode) return null;

    const bb = kNode.getClientRect({
        relativeTo: kNode.getStage(),
        skipStroke: true,
        skipShadow: true,
    });

    return (
        <Rect
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
};
