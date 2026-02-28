import { Transformer } from "react-konva";
import { ROTATION_SNAP_TOLERANCE, ROTATION_SNAPS, SHAPES } from "../constants";
import { memo, useCallback, useEffect } from "react";
import { useNodeStore } from "../store/node-store";
import { patchStoreRaf } from "../store/patchStoreRaf";
import { getShape } from "./shapes";
import { useActionsStore } from "../store/actions-store";
import { dragBound } from "./utils/dragBound";
import { isLineLikeType } from "../utils";
import { useInteractiveStore } from "../store/interactive-store";

function transformStartHandler() {
    patchStoreRaf.cancel();
    useInteractiveStore.getState().begin();
}

function transformHandler(e) {
    const node = e.target;
    const id = node.attrs.id;
    const type = node.attrs.type;

    const shape = getShape(type);
    if (!shape?.onTransform) {
        console.warn("No onTransform handler for shape type:", type);
        return;
    }
    const res = shape.onTransform(node);
    if (!res) return;

    let patch = {};
    if (type === SHAPES.group) {
        Object.assign(patch, res);
    } else {
        patch[id] = res;
    }
    patchStoreRaf(patch);
}

function transformEndHandler(nodes) {
    if (nodes.length === 0) return;
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
    patchStoreRaf(patchesById);
    patchStoreRaf.flushNow();
    useInteractiveStore.getState().commit();
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
            nodes[selectedIds[0]] &&
            isLineLikeType(nodes[selectedIds[0]].type)
        ) {
            transformer.nodes([]);
            return;
        }

        const instances = selectedIds
            .map((id) => nodesRef.current.get(id))
            .filter(Boolean);

        if (instances.length !== selectedIds.length) {
            transformer.nodes([]);
            return;
        }

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
            onTransformStart={transformStartHandler}
        />
    );
};
export default memo(HMITransformer);
