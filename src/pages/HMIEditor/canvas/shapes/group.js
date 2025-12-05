import { SHAPES } from "../../constants";
import { useActionsStore } from "../../store/actions-store";
import { useNodeStore } from "../../store/node-store";
import { round4 } from "../../utils";
import { getShape, registerShape } from "./registry";

registerShape(SHAPES.group, {
    onTransformEnd(konvaNode) {
        const width = konvaNode.width();
        const height = konvaNode.height();

        const children = konvaNode.getChildren();
        if (children.length === 0) return;
        const ids = children.map((node) => node.id());
        let patchesById = {};
        for (const child of children) {
            const { id, type } = child.attrs;
            const shape = getShape(type);
            const { gridSize, snapToGrid } = useActionsStore.getState();
            const ctx = { gridSize, snapToGrid };
            if (shape && typeof shape.onTransformEnd === "function") {
                patchesById[id] = shape.onTransformEnd(child, ctx);
            } else {
                console.warn("No onTransformEnd handler for shape type:", type);
            }
        }
        useNodeStore.getState().updateNodes(ids, patchesById);

        const patch = {
            x: round4(konvaNode.x()),
            y: round4(konvaNode.y()),
            width: Math.round(width),
            height: Math.round(height),
            rotation: round4(konvaNode.rotation()),
        };

        konvaNode.scaleX(1);
        konvaNode.scaleY(1);

        return patch;
    },

    onTransform(konvaNode) {
        const scaleX = konvaNode.scaleX();
        const scaleY = konvaNode.scaleY();

        const children = konvaNode.getChildren();
        if (children.length === 0) return;

        for (const child of children) {
            const type = child.attrs.type;
            const shape = getShape(type);
            if (shape && typeof shape.onGroupMod === "function") {
                shape.onGroupMod(child, scaleX, scaleY);
            } else {
                console.warn("No onGroupMod handler for shape type:", type);
            }
        }
    },

    toModelFromKonva(konvaNode) {
        const a = konvaNode.attrs;
        return {
            type: SHAPES.group,
            id: a.id,
            x: round4(a.x),
            y: round4(a.y),
            width: Math.round(a.width),
            height: Math.round(a.height),
            rotation: round4(a.rotation),
        };
    },
});
