import { Rect, Transformer } from "react-konva";
import { ROTATION_SNAP_TOLERANCE, ROTATION_SNAPS, SHAPES } from "../constants";
import { memo, useCallback, useEffect } from "react";
import { useNodeStore } from "../store/node-store";
import { getShape } from "./shapes";
import { useActionsStore } from "../store/actions-store";
import { dragBound } from "./utils/dragBound";
//import { isLineLikeType } from "../utils";

function collectInstancesFromSelection(selectedIds, nodesRef) {
    const result = [];
    for (const id of selectedIds) {
        const node = nodesRef.current.get(id);
        if (!node) continue;
        collectEditableNodesFromNode(node, result);
    }
    return result;
}

function collectEditableNodesFromNode(node, result = []) {
    const type = node.attrs.type;
    if (type === SHAPES.group) {
        node.getChildren().forEach((child) => {
            collectEditableNodesFromNode(child, result);
        });
    } else {
        result.push(node);
    }
    return result;
}

const HMITransformer = ({ nodesRef, transformerRef, canvasRef }) => {
    const selectedIds = useNodeStore((state) => state.selectedIds);
    //const primaryNode = useNodeStore((state) => state.nodes[selectedIds[0]]);
    console.log("Render HMITRansformer", nodesRef, selectedIds);

    /* const isLineLike =
        primaryNode &&
        selectedIds.length === 1 &&
        isLineLikeType(primaryNode.type); */

    useEffect(() => {
        const transformer = transformerRef.current;
        if (!transformer) return;

        if (selectedIds.length > 0) {
            const instances = collectInstancesFromSelection(
                selectedIds,
                nodesRef,
            );
            transformer.nodes(instances);
        } else {
            transformer.nodes([]);
        }
    }, [selectedIds, nodesRef, transformerRef]);

    const anchorBound = useCallback(
        function (_oldPos, newPos) {
            const { gridSize, snapToGrid } = useActionsStore.getState();
            const stage = canvasRef.current;
            return dragBound(newPos, stage, gridSize, snapToGrid);
        },
        [canvasRef],
    );

    const transformEndHandler = () => {
        const nodes = transformerRef.current.nodes();
        if (nodes.length === 0) return;
        const ids = nodes.map((node) => node.id());
        let patchesById = {};
        for (const node of nodes) {
            const { id, type } = node.attrs;
            const shape = getShape(type);
            if (shape && typeof shape.onTransformEnd === "function") {
                patchesById[id] = shape.onTransformEnd(node);
            } else {
                console.warn("No onTransformEnd handler for shape type:", type);
            }
        }
        useNodeStore.getState().updateNodes(ids, patchesById);
    };

    const transformHandler = (e) => {
        const node = e.target;
        const type = node.attrs.type;
        const shape = getShape(type);

        if (shape && typeof shape.onTransform === "function") {
            shape.onTransform(node);
        } else {
            console.warn("No onTransform handler for shape type:", type);
        }
    };

    //if (isLineLike) return null;

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
